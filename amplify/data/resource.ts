import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  RSVP: a
    .model({
      fullName: a.string().required(),
      email: a.string(),
      phone: a.string(),
      guestCount: a.integer().required(),
      attending: a.boolean().required(),
      arrivalInfo: a.string(),
      songRequest: a.string(),
      message: a.string(),
      language: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.group("ADMINS").to(["read", "update"]),
    ]),
  GuestPhoto: a
    .model({
      storagePath: a.string(),
      originalFileName: a.string(),
      uploaderName: a.string(),
      message: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create", "read"]),
      allow.group("ADMINS").to(["read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
