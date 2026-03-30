import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { fileURLToPath } from "node:url";

const functionAssetPath = fileURLToPath(new URL(".", import.meta.url));

export const guestPhotoUpload = defineFunction((scope) =>
  new Function(scope, "guest-photo-upload-lambda", {
    runtime: Runtime.NODEJS_20_X,
    handler: "handler.handler",
    code: Code.fromAsset(functionAssetPath),
    timeout: Duration.seconds(30),
  }),
);
