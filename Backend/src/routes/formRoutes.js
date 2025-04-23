import express from "express";
import { receiveFormData } from "../controllers/formController.js";
import { authenticateJWT } from "../middleware/authenticate.js";
import {
  acceptOffer,
  deleteItemByEntryId,
  getAllEntryIds,
  getApplicationsForUser,
  getOffersForUser,
  makeOffer,
  makeOfferMiddleware,
} from "../services/dynamoServices.js";

const router = express.Router();

// Allow unauthenticated form submissions
router.post("/receive-form-data", receiveFormData);
router.get("/get-user-forms", authenticateJWT, getApplicationsForUser);
router.get("/get-user-offers", authenticateJWT, getOffersForUser);
router.post("/make-offer", authenticateJWT, makeOfferMiddleware, makeOffer);
router.put("/accept-given-offer", authenticateJWT, acceptOffer);
router.delete("/delete-item/:entryId", authenticateJWT, deleteItemByEntryId);
router.get("/get-all-entries", authenticateJWT, getAllEntryIds);

export default router;
