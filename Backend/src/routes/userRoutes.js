import express from "express";
import {
  signup,
  confirmSignup,
  signIn,
  logOut,
  confirmPassword,
  changeUserEmail,
  changeUserPassword,
} from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signIn);
router.post("/logout", logOut);
router.post("/confirm-signup", confirmSignup);
router.post(
  "/change-user-email",
  authenticateJWT,
  confirmPassword,
  changeUserEmail
);
router.post(
  "/change-user-password",
  authenticateJWT,
  confirmPassword,
  changeUserPassword
);
router.post("/validate-token", authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    userType: req.user.usertype,
  });
});

export default router;
