import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../../amplify_outputs.json";
import type { Schema } from "../../amplify/data/resource";

const hasAmplifyConfig =
  typeof outputs === "object" &&
  outputs !== null &&
  Object.keys(outputs).length > 0;

if (hasAmplifyConfig) {
  Amplify.configure(outputs);
}

export const amplifyConfigured = hasAmplifyConfig;
export const client = generateClient<Schema>();
