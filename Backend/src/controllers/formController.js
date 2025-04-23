import {
  addItemToTable,
  addApplicationToUser,
  checkApplicationLimit
} from "../services/dynamoServices.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getSecrets } from "../utils/secrets.js";

let secrets;
(async () => {
  secrets = await getSecrets();
})();

const client = async () => {
  const secrets = await getSecrets();
  return new DynamoDBClient({
    region: secrets.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: secrets.AWS_ACCESS_KEY_ID,
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const receiveFormData = async (req, res) => {
  console.log("Receiving...");
  try {
    const user = req.user;
    console.log("Request body:", req.body);

    // Initialize limitCheck with default values
    let limitCheck = {
      canSubmit: true,
      currentCount: 0,
      limit: 10
    };

    // Check application limit for new applications
    if (req.body.entryType !== "offer") {
      limitCheck = await checkApplicationLimit(user.userId);
      if (!limitCheck.canSubmit) {
        return res.status(400).json({
          success: false,
          error: "Application limit reached",
          message: `You have reached the maximum limit of ${limitCheck.limit} applications. Please delete some applications before submitting new ones.`,
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit
        });
      }
    }

    const entryType = req.body.entryType || "application";
    const offerId = req.body.offerId || null;

    // Generate new UUID for entryId
    const entryId = uuidv4();
    console.log("Generated entryId:", entryId);

    let applicationData = {
      userId: user.userId,
      username: user.username,
      formData: req.body,
      entryId: String(entryId),
      timestamp: new Date().toISOString(),
      status: entryType === "offer" ? "pending" : "applied - pending",
      entryType,
    };

    if (entryType === "offer" && offerId) {
      applicationData.offerId = offerId;
    }

    console.log("applicationData to save:", applicationData);

    await addApplicationToUser(applicationData);

    res.status(200).json({
      success: true,
      message: "Form data saved successfully!",
      entryId,
      currentCount: limitCheck.currentCount + 1,
      limit: limitCheck.limit
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({
      error: "An error occurred while saving the form data.",
    });
  }
};
