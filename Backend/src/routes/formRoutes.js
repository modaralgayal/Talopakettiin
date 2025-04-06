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

router.post("/receive-form-data", authenticateJWT, receiveFormData);
router.get("/get-user-forms", authenticateJWT, getApplicationsForUser);
router.post("/delete-user-entry", authenticateJWT, deleteItemByEntryId);
router.get("/get-all-entries", authenticateJWT, getAllEntryIds);
router.get("/get-user-offers", authenticateJWT, getOffersForUser);
router.put("/accept-given-offer", authenticateJWT, acceptOffer);
router.get("/test-sub-content", authenticateJWT);
router.post("/make-offer", authenticateJWT, makeOfferMiddleware, makeOffer);

export default router;
