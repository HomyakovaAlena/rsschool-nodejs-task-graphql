import {
  isErrorNoRequiredEntity,
  throwError,
} from "../../lib/errorHandling/errorChecker";
import {
  areAllFieldsDefined,
  areAllTypesCorrect,
  isEmptyBody,
  isValidUuid,
} from "../../lib/validation/common.validation";
import { isValidMemberType } from "../../lib/validation/member-types.validation";
import DB from "../../utils/DB/DB";
import { CreatePostDTO } from "../../utils/DB/entities/DBPosts";
import { CreateProfileDTO } from "../../utils/DB/entities/DBProfiles";
import { CreateUserDTO } from "../../utils/DB/entities/DBUsers";

export const createUser = (db: DB, user: CreateUserDTO) => {
  try {
    const { firstName, lastName, email } = user;

    if (!areAllFieldsDefined([firstName, lastName, email]))
      return new Error("Not all required fields provided");
    if (!areAllTypesCorrect(user, "users"))
      return new Error("Not all fields are of correct types");

    return db.users.create({ firstName, lastName, email });
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const createPost = async (db: DB, post: CreatePostDTO) => {
  const { content, title, userId } = post;
  try {
    if (isEmptyBody(post)) throw new Error("Empty body");
    if (!areAllFieldsDefined([content, title, userId]))
      throw new Error("Not all required fields provided");
    if (!isValidUuid(userId)) throw new Error("User Id is not valid");
    if (!areAllTypesCorrect(post, "posts"))
      throw new Error("Not all fields are of correct types");

    return db.posts.create({ content, title, userId });
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const createProfile = async (db: DB, profile: CreateProfileDTO) => {
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
    } = profile;

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
      throw new Error("Not all required fields provided");
    if (!areAllTypesCorrect(profile, "profiles"))
      throw new Error("Not all fields are of correct types");
    if (!isValidMemberType(memberTypeId))
      throw new Error("Not valid member-type");
    if (!(await db.users.findOne({ key: "id", equals: userId })))
      throw new Error("User not found");
    if (await db.profiles.findOne({ key: "userId", equals: userId }))
      throw new Error("Profile has been already created");

    return db.profiles.create(profile);
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};
