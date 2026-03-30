"use strict";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: process.env.AWS_REGION });

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const method = event?.requestContext?.http?.method || event?.httpMethod;

  if (method === "OPTIONS") {
    return json(204, {});
  }

  if (method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const bucketName = process.env.GUEST_PHOTO_BUCKET_NAME;
  if (!bucketName) {
    return json(500, { error: "Bucket configuration is missing" });
  }

  const payload = event?.body ? JSON.parse(event.body) : {};
  const originalFileName = payload.originalFileName?.trim();

  if (!originalFileName) {
    return json(400, { error: "originalFileName is required" });
  }

  const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `guest-photos/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
      ContentType: payload.contentType || "application/octet-stream",
    }),
    { expiresIn: 300 },
  );

  return json(200, {
    uploadUrl,
    storagePath,
  });
};
