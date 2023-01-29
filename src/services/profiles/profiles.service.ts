import { FastifyReply } from "fastify";
import { isErrorNoRequiredEntity } from "../../lib/errorHandling/errorChecker";
import {
  replyBadRequest,
  replyNotFound,
} from "../../lib/errorHandling/replyMessager";
import {
  areAllFieldsDefined,
  areAllTypesCorrect,
  isEmptyBody,
} from "../../lib/validation/common.validation";
import { isValidMemberType } from "../../lib/validation/member-types.validation";
import DB from "../../utils/DB/DB";
import { CreateProfileDTO } from "../../utils/DB/entities/DBProfiles";

export type Body = {
  [key: string]: any;
};

export const getProfiles = async (db: DB) => {
  return await db.profiles.findMany();
};

export const getProfileById = async (
  db: DB,
  id: string,
  reply: FastifyReply
) => {
  try {
    const profileFound = await db.profiles.findOne({
      key: "id",
      equals: id,
    });
    if (!profileFound) return replyNotFound(reply, "Profile not found");

    return profileFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const createProfile = async (
  db: DB,
  body: Body,
  reply: FastifyReply
) => {
  try {
    const {
      userId,
      avatar,
      sex,
      birthday,
      country,
      street,
      city,
      memberTypeId,
    } = body;

    if (
      !areAllFieldsDefined([
        userId,
        avatar,
        sex,
        birthday,
        country,
        street,
        city,
        memberTypeId,
      ])
    )
      return replyBadRequest(reply, "Not all required fields provided");
    if (!areAllTypesCorrect(body, "profiles"))
      return replyBadRequest(reply, "Not all fields are of correct types");
    if (!isValidMemberType(memberTypeId))
      return replyBadRequest(reply, "Not valid member-type");
    if (!(await db.users.findOne({ key: "id", equals: userId })))
      return replyBadRequest(reply, "User not found");
    if (await db.profiles.findOne({ key: "userId", equals: userId }))
      return replyBadRequest(reply, "Profile has been already created");

    return await db.profiles.create(body as CreateProfileDTO);
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const deleteProfile = async (
  db: DB,
  id: string,
  reply: FastifyReply
) => {
  try {
    if (
      !(await db.profiles.findOne({
        key: "id",
        equals: id,
      }))
    )
      return replyBadRequest(reply, "Profile not found");

    return await db.profiles.delete(id);
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const updateProfile = async (
  db: DB,
  id: string,
  body: Body,
  reply: FastifyReply
) => {
  try {
    if (!areAllTypesCorrect(body, "profiles"))
      return replyBadRequest(reply, "Not all fields are of correct types");

    if (isEmptyBody(body)) return replyBadRequest(reply, "Empty body");
    const correctedProfile = await db.profiles.change(id, body);
    return correctedProfile;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};
