import jwt, { decode } from "jsonwebtoken";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { getSecrets } from "../utils/secrets.js";

let cognitoClient;

async function initCognitoClient() {
  if (!cognitoClient) {
    const secrets = await getSecrets();
    cognitoClient = new CognitoIdentityProviderClient({
      region: secrets.AWS_DEFAULT_REGION,
    });
  }
}

const generateSecretHash = (username, clientId, clientSecret) => {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
};

export const signup = async (req, res) => {
  console.log("Signing up");
  try {
    const { username, password, email, userType } = req.body;

    if (!["customer", "provider"].includes(userType)) {
      throw new Error(
        "Invalid user type. Allowed values are 'Customer' or 'Provider'."
      );
    }

    await initCognitoClient();
    const secrets = await getSecrets();

    const secretHash = generateSecretHash(
      username,
      secrets.AWS_CLIENT_ID,
      secrets.AWS_CLIENT_SECRET
    );

    const params = {
      ClientId: secrets.AWS_CLIENT_ID,
      SecretHash: secretHash,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "custom:UserType",
          Value: userType,
        },
      ],
    };

    const command = new SignUpCommand(params);
    const data = await cognitoClient.send(command);

    res.json(data);
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(400).json({ error: error.message });
  }
};

export const confirmSignup = async (req, res) => {
  try {
    const { username, confirmationCode } = req.body;

    await initCognitoClient();
    const secrets = await getSecrets();

    const secretHash = generateSecretHash(
      username,
      secrets.AWS_CLIENT_ID,
      secrets.AWS_CLIENT_SECRET
    );

    const params = {
      ClientId: secrets.AWS_CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    };

    const command = new ConfirmSignUpCommand(params);
    const data = await cognitoClient.send(command);

    res.json({ message: "User confirmed successfully!", data });
  } catch (error) {
    console.error("Error in confirmSignup:", error);
    res.status(400).json({ error: error.message });
  }
};

export const confirmPassword = async (req, res, next) => {
  try {
    const { oldPassword } = req.body;
    const username = req.user.username;

    if (!username || !oldPassword) {
      throw new Error("Username and password are required.");
    }

    await initCognitoClient();
    const secrets = await getSecrets();

    const secretHash = generateSecretHash(
      username,
      secrets.AWS_CLIENT_ID,
      secrets.AWS_CLIENT_SECRET
    );

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: secrets.AWS_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: oldPassword,
        SECRET_HASH: secretHash,
      },
    };

    const command = new InitiateAuthCommand(params);

    // Send the authentication request
    const data = await cognitoClient.send(command);

    if (data.AuthenticationResult) {
      // Password is correct
      console.log("Success");
    } else {
      throw new Error("Invalid password.");
    }
    console.log("Password Confirmed");
    next();
  } catch (error) {
    console.error("Error in confirmPassword:", error);
    res.status(400).json({
      success: false,
      message:
        error.message || "An error occurred while confirming the password.",
    });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.user.username;

    if (!newPassword) throw new Error("New password is required");
    await initCognitoClient();
    const secrets = await getSecrets();

    const params = {
      UserPoolId: secrets.AWS_USER_POOL_ID,
      Username: username,
      Password: newPassword,
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(params);
    await cognitoClient.send(command);

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
    return;
  } catch (error) {
    console.error("Error in changeUserPassword: ", error);
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while updating password.",
    });
  }
};

export const changeUserEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    console.log("This is the new email: ", newEmail);
    const username = req.user.username;

    if (!newEmail) throw new Error("New email is required.");

    await initCognitoClient();
    const secrets = await getSecrets();

    const params = {
      UserPoolId: secrets.AWS_USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: "email",
          Value: newEmail,
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await cognitoClient.send(command);

    res.status(200).json({
      success: true,
      message: "Email updated successfully.",
    });
  } catch (error) {
    console.error("Error in changeUserEmail:", error);
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while updating email.",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    await initCognitoClient();
    const secrets = await getSecrets();

    const secretHash = generateSecretHash(
      username,
      secrets.AWS_CLIENT_ID,
      secrets.AWS_CLIENT_SECRET
    );

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: secrets.AWS_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    const command = new InitiateAuthCommand(params);
    const data = await cognitoClient.send(command);

    const idToken = data.AuthenticationResult.IdToken;

    // Decode the ID token to extract user attributes
    const decodedIdToken = decode(idToken);
    if (!decodedIdToken || !decodedIdToken.sub) {
      throw new Error("Invalid ID token.");
    }

    // Extract userType from the decoded ID token
    const userTypeFromToken = decodedIdToken["custom:UserType"];
    // if (userTypeFromToken !== userType) {
    //   throw new Error("User type mismatch. Access denied.");
    // }

    // Continue with JWT signing or response setup
    const userSub = decodedIdToken.sub;
    const jwtToken = jwt.sign(
      {
        sub: userSub, // user identifier (Cognito user sub)
        clientId: secrets.AWS_CLIENT_ID, // client id from secrets
        username, // username
        userType: userTypeFromToken, // Add userType to the custom JWT
      },
      secrets.MY_SECRET_JWT_KEY, // Secret key to sign the JWT
      { expiresIn: "1h" } // Expiry time for the token
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the JWT token in a secure cookie
    res.cookie("token", jwtToken, {
      secure: isProduction, // Use secure cookies in production
      httpOnly: true, // Ensure the cookie is HTTP only (cannot be accessed via JavaScript)
      path: "/",
      sameSite: isProduction ? "None" : "Lax", // SameSite option for cross-site cookies
      domain: isProduction ? "talopakettiin.fi" : undefined, // Set domain for production
    });

    // Send response with tokens and redirect URL
    res.json({
      success: true,
      message: "Sign in successful!",
      redirectUrl: "https://talopakettiin.fi/my-home-page-2/",
      accessToken: data.AuthenticationResult.AccessToken,
      idToken,
      refreshToken: data.AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(400).json({ error: error.message });
  }
};

export const logOut = (req, res) => {
  console.log("Logging out");

  try {
    const isLocalhost = req.headers.origin?.includes("localhost");

    const cookieOptions = {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "None", // Required when using cross-site cookies with Secure
    };

    if (!isLocalhost) {
      // Only set the domain if it's not localhost
      cookieOptions.domain = "talopakettiin.fi";
    }

    res.cookie("token", "", cookieOptions);
    res.cookie("usertype", "", cookieOptions);

    // ✅ Return a proper response with CORS compatibility
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logOut:", error);
    res.status(400).json({ error: error.message });
  }
};
