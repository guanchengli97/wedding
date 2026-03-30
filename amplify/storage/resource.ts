import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "weddingGuestPhotos",
  isDefault: true,
  access: (allow) => ({
    "guest-photos/*": [
      allow.guest.to(["read", "write"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
  }),
});
