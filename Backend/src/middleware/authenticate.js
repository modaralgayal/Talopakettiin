import jwt from "jsonwebtoken";
import { getSecrets } from "../utils/secrets.js";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

let cognitoClient;

async function initCognitoClient() {
  if (!cognitoClient) {
    const secrets = await getSecrets();
    cognitoClient = new CognitoIdentityProviderClient({
      region: secrets.AWS_DEFAULT_REGION,
    });
  }
}

export const verifyAndDecodeJWT = async (token) => {
  try {
    await initCognitoClient();
    const secrets = await getSecrets();

    const decoded = jwt.verify(token, secrets.MY_SECRET_JWT_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const authenticateJWT = async (req, res, next) => {
  console.log("Authenticating user");
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("Token not found in Backend");
      return res.sendStatus(401);
    }

    const decodedToken = await verifyAndDecodeJWT(token);
    console.log("This is the decoded token: ", decodedToken);

    if (!decodedToken) {
      console.log("Invalid or expired token");
      return res.sendStatus(401);
    }

    const userId = decodedToken.sub;

    if (!userId) {
      console.log("User ID (sub) not found in the token");
      return res.sendStatus(403);
    }

    const usertype = decodedToken.userType;
    req.user = { userId, usertype, ...decodedToken };

    next();
  } catch (err) {
    console.error("Error in authenticateJWT:", err.message);
    res.status(500).json({
      error: `An internal error occurred while authenticating the token: ${err.message}`,
    });
  }
};
