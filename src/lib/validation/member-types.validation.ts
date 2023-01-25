import { changeMemberTypeBodySchema } from "../../routes/member-types/schema";

export const correctMemberTypes = changeMemberTypeBodySchema.properties;

export const isValidMemberType = (memberTypeId: string) =>
  ["basic", "business"].includes(memberTypeId);
