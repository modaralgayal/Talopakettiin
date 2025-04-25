import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { getSecrets } from "../utils/secrets.js";
import dotenv from "dotenv";

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (req, res) => {
  console.log("Looking for Google token in request body:", req.body);
  try {
    const { token, userType } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    if (!userType || !["customer", "provider"].includes(userType)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid userType is required" });
    }

    const secrets = await getSecrets();

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Create our own JWT token
    const jwtToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        userType: userType,
      },
      secrets.MY_SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    // Set cookie with proper settings for development
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000, // 1 hour
    });

    // Also set a userType cookie
    res.cookie("userType", userType, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });

    console.log({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      userType: userType,
    });
    // Return the user information in the response

    return res.status(200).json({
      success: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        userType: userType,
      },
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};
