import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
  QueryCommand,
  DeleteItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import nodemailer from "nodemailer";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getSecrets, parseDynamoItem } from "../utils/secrets.js";
import multer from "multer";

const initDynamoDBClient = async () => {
  const secrets = await getSecrets();
  return new DynamoDBClient({
    region: secrets.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: secrets.AWS_ACCESS_KEY_ID,
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const scanTable = async () => {
  const client = await initDynamoDBClient();
  const params = { TableName: "talopakettiin" };
  const data = await client.send(new ScanCommand(params));
  return data.Items.map((item) => unmarshall(item));
};

export const addItemToTable = async (item) => {
  const client = await initDynamoDBClient();
  const params = {
    TableName: "talopakettiin",
    Item: marshall(item),
  };
  await client.send(new PutItemCommand(params));
};

export const addApplicationToUser = async (item) => {
  const client = await initDynamoDBClient();
  const id = uuidv4();

  console.log("Adding to DynamoDB:", item);

  const params = {
    TableName: "Talopakettiin-API",
    Item: marshall({ ...item, id }),
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Form ID successfully logged in DynamoDB.");
  } catch (error) {
    console.error("Error adding Form ID to DynamoDB:", error);
  }
};

export const getApplicationsForUser = async (req, res) => {
  if (req.user.usertype !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }
  try {
    const userId = req.user.userId;
    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
    };

    const command = new QueryCommand(params);
    const data = await client.send(command);

    const applications = data.Items.map(parseDynamoItem);
    console.log("Parsed Applications:", applications);
    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications for user:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

export const getAllEntryIds = async (req, res) => {
  try {
    if (req.user.usertype !== "provider") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a provider" });
    }

    console.log("got here");
    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      FilterExpression: "#entryType = :entryTypeVal",
      ExpressionAttributeNames: {
        "#entryType": "entryType",
      },
      ExpressionAttributeValues: {
        ":entryTypeVal": { S: "application" },
      },
    };

    const command = new ScanCommand(params);
    const data = await client.send(command);
    console.log("This is the data", data);

    const result = data.Items.map((item) => {
      const parsedItem = {};
      for (const key in item) {
        parsedItem[key] = Object.values(item[key])[0];
      }
      return parsedItem;
    });

    console.log("Fetched entries:", result);

    res.status(200).json({ entries: result });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

export const getOffersForUser = async (req, res) => {
  if (req.user.usertype !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }
  try {
    const userId = req.user.userId;
    const client = await initDynamoDBClient();

    console.log("User ID:", userId);

    const applicationParams = {
      TableName: "Talopakettiin-API",
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
    };

    const applicationCommand = new QueryCommand(applicationParams);
    console.log("Application Params:", applicationParams);

    const applicationData = await client.send(applicationCommand);
    console.log("Application Data:", JSON.stringify(applicationData, null, 2));

    // Safely extract entryId values
    const applicationIds = applicationData.Items.map(
      (item) => item.entryId?.S
    ).filter((entryId) => entryId !== undefined); // Remove undefined values
    console.log("Application IDs:", applicationIds);

    if (applicationIds.length === 0) {
      return res.status(200).json({ offers: [] });
    }

    let offers = [];

    for (const entryId of applicationIds) {
      const offerParams = {
        TableName: "Talopakettiin-API",
        IndexName: "entryType-entryId-index",
        KeyConditionExpression: "entryType = :entryType AND entryId = :entryId",
        ExpressionAttributeValues: {
          ":entryType": { S: "offer" },
          ":entryId": { S: entryId },
        },
      };

      const offerCommand = new QueryCommand(offerParams);
      const offerData = await client.send(offerCommand);
      console.log("Offer Params:", offerParams);
      console.log("Offer Data:", JSON.stringify(offerData, null, 2));

      if (offerData.Items?.length > 0) {
        // Map all attributes for each item
        const mappedOffers = offerData.Items.map((item) => {
          const attributes = {};
          for (const key in item) {
            // Dynamically handle both S (string) and N (number) types
            attributes[key] = item[key]?.S || item[key]?.N || null;
          }
          return attributes;
        });
        offers.push(...mappedOffers);
      } else {
        console.log(`No offers found for entryId: ${entryId}`);
      }
    }

    const cleanedEntry = JSON.stringify(offers, null, 2);

    console.log("Final Offers:", JSON.stringify(offers, null, 2));
    res.status(200).json({
      success: true,
      data: { offers }, // Return offers in the expected format
    });
  } catch (error) {
    console.error("Error fetching offers for user:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const deleteItemByEntryId = async (req, res) => {
  if (req.user.usertype !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }
  const { entryIdToDelete } = req.body;
  console.log("Attempting to delete item with entryId: ", entryIdToDelete);

  const client = await initDynamoDBClient();

  const queryParams = {
    TableName: "Talopakettiin-API",
    IndexName: "entryId-userId-index",
    KeyConditionExpression: "entryId = :entryId",
    ExpressionAttributeValues: {
      ":entryId": { S: entryIdToDelete.toString() },
    },
  };

  try {
    const data = await client.send(new QueryCommand(queryParams));

    if (data.Items && data.Items.length > 0) {
      const item = unmarshall(data.Items[0]);
      const idToDelete = item.id;

      const deleteParams = {
        TableName: "Talopakettiin-API",
        Key: {
          id: { S: idToDelete },
        },
      };

      await client.send(new DeleteItemCommand(deleteParams));
      console.log(`Successfully deleted item with entryId: ${entryIdToDelete}`);
      res.status(200).json({
        message: `Successfully deleted item with entryId: ${entryIdToDelete}`,
      });
    } else {
      console.log(`No item found with entryId: ${entryIdToDelete}`);
      res.status(404).json({
        error: `No item found with entryId: ${entryIdToDelete}`,
      });
    }
  } catch (error) {
    console.error(
      `Error deleting item with entryId: ${entryIdToDelete}`,
      error
    );
    res.status(500).json({
      error: `Failed to delete item with entryId: ${entryIdToDelete}`,
    });
  }
};

export const acceptOffer = async (req, res) => {
  if (req.user.usertype !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }
  try {
    const dynamoDBClient = await initDynamoDBClient();
    const { id, entryId, "Email Address": emailAddress } = req.body;

    console.log("Request Body: ", req.body);

    if (!id || !entryId) {
      throw new Error("Missing 'id' or 'entryId' in request body.");
    }

    // Step 1: Update Offer Status to "Accepted"
    const offerUpdateParams = {
      TableName: "Talopakettiin-API",
      Key: { id: { S: id } },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": { S: "Accepted" } },
      ReturnValues: "ALL_NEW",
    };

    console.log("Updating Offer:", offerUpdateParams);
    await dynamoDBClient.send(new UpdateItemCommand(offerUpdateParams));

    // Step 2: Query Applications using entryType-entryId GSI
    const queryParams = {
      TableName: "Talopakettiin-API",
      IndexName: "entryType-entryId-index", // Your GSI name
      KeyConditionExpression: "entryType = :entryType AND entryId = :entryId",
      ExpressionAttributeValues: {
        ":entryType": { S: "application" },
        ":entryId": { S: entryId },
      },
    };

    console.log("Querying Applications:", queryParams);
    const queryResult = await dynamoDBClient.send(
      new QueryCommand(queryParams)
    );
    const applications = queryResult.Items || [];

    console.log("Applications Found:", applications.length);

    // Step 3: Batch Update Application Statuses
    for (const app of applications) {
      const updateParams = {
        TableName: "Talopakettiin-API",
        Key: { id: { S: app.id.S } },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": { S: "Accepted" } },
      };

      console.log("Updating Application:", updateParams);
      await dynamoDBClient.send(new UpdateItemCommand(updateParams));
    }

    // Step 4: Send Email Notification
    const secrets = await getSecrets();
    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: "talopakettiin.fi",
        pass: secrets.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "info@talopakettiin.fi",
      to: emailAddress,
      subject: "Offer Accepted Notification",
      text: `Hello,

      The offer with ID ${id} has been accepted. All related applications have been updated accordingly.

      Thank you,
      Talopakettiin Team`,
    };

    console.log("Sending Email:", mailOptions);
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Offer accepted, applications updated, and email sent.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process the request.",
      error: error.message,
    });
  }
};

const storage = multer.memoryStorage(); // Store in memory; can change to disk
const upload = multer({ storage });

export const makeOfferMiddleware = upload.single("pdfFile"); // handles multipart/form-data with one file field: pdfFile

export const makeOffer = async (req, res) => {
  try {
    if (req.user.usertype !== "provider") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a provider" });
    }

    const { offerData, userId, entryId } = req.body;
    const providerId = req.user.userId;

    if (!offerData || !userId || !entryId) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Parse offerData string back to object
    let parsedOfferData;
    try {
      parsedOfferData = JSON.parse(offerData);
    } catch (err) {
      return res.status(400).json({ error: "Invalid offerData format." });
    }

    // Attach file buffer if present
    if (req.file) {
      parsedOfferData.pdfFile = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer.toString("base64"), // Base64 encoding for safe storage
      };
    }

    const offerId = uuidv4();
    const offerItem = {
      id: offerId,
      offerData: parsedOfferData,
      userId,
      providerId,
      entryId,
      username: req.user.username,
      entryType: "offer",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      Item: marshall(offerItem),
    };

    await client.send(new PutItemCommand(params));

    res.status(200).json({ success: true, message: "Offer sent successfully" });
  } catch (error) {
    console.error("Error sending offer:", error);
    res.status(500).json({ error: "Failed to send offer" });
  }
};
