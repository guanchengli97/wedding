"use strict";

const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
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

  const uploadUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucketName,
    Key: storagePath,
    ContentType: payload.contentType || "application/octet-stream",
    Expires: 300,
  });

  return json(200, {
    uploadUrl,
    storagePath,
  });
};
