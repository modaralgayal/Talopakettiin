import express from "express";
import { logOut } from "../controllers/userController.js";
import { verifyGoogleToken } from "../controllers/googleAuthController.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = express.Router();

// Google Auth routes
router.post("/google-auth", verifyGoogleToken);

// Logout route
router.post("/logout", logOut);

// Validate token route
router.post("/validate-token", authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    userType: req.user.userType,
  });
});

export default router;
