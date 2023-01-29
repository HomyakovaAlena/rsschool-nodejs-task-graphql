// import { createUserBodySchema } from "../../routes/users/schemas";

export const correctUsersTypes = {
  firstName: { type: "string" },
  lastName: { type: "string" },
  email: { type: "string" },
  subscribedToUserIds: { type: "object" },
  userId: { type: "string" },
  id: { type: "string" },
};
