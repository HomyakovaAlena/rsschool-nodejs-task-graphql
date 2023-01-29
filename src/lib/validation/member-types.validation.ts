// import { changeMemberTypeBodySchema } from "../../routes/member-types/schema";

export const correctMemberTypes = {
  discount: { type: "number" },
  monthPostsLimit: { type: "number" },
  id: { type: "string" },
};

export const isValidMemberType = (memberTypeId: string) =>
  ["basic", "business"].includes(memberTypeId);
