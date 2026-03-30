import { defineBackend } from "@aws-amplify/backend";
import { AnyPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { FunctionUrlAuthType, HttpMethod, InvokeMode } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { guestPhotoUpload } from "./functions/guest-photo-upload/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  guestPhotoUpload,
  storage,
});

backend.storage.resources.bucket.addToResourcePolicy(
  new PolicyStatement({
    principals: [new AnyPrincipal()],
    actions: ["s3:GetObject"],
    resources: [backend.storage.resources.bucket.arnForObjects("guest-photos/*")],
  }),
);

backend.storage.resources.cfnResources.cfnBucket.publicAccessBlockConfiguration = {
  blockPublicAcls: false,
  ignorePublicAcls: false,
  blockPublicPolicy: false,
  restrictPublicBuckets: false,
};
backend.storage.resources.cfnResources.cfnBucket.corsConfiguration = {
  corsRules: [
    {
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "HEAD", "PUT"],
      allowedHeaders: ["*"],
      exposedHeaders: ["ETag"],
      maxAge: 3000,
    },
  ],
};

backend.guestPhotoUpload.addEnvironment("GUEST_PHOTO_BUCKET_NAME", backend.storage.resources.bucket.bucketName);
backend.storage.resources.bucket.grantPut(backend.guestPhotoUpload.resources.lambda, "guest-photos/*");

const guestPhotoUploadUrl = backend.guestPhotoUpload.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  invokeMode: InvokeMode.BUFFERED,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["content-type"],
  },
});

backend.addOutput({
  custom: {
    guestPhotoUploadUrl: guestPhotoUploadUrl.url,
  },
});
