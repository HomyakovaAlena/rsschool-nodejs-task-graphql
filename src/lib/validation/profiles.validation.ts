export const correctProfilesTypes = {
  avatar: { type: "string" },
  sex: { type: "string" },
  birthday: { type: "number" },
  country: { type: "string" },
  street: { type: "string" },
  city: { type: "string" },
  userId: { type: "string", format: "uuid" },
  memberTypeId: {
    type: "string",
  },
  id: { type: "string" },
};
