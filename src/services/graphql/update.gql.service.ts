import {
  isErrorForbiddenOperation,
  isErrorNoRequiredEntity,
  throwError,
} from "../../lib/errorHandling/errorChecker";
import {
  areAllFieldsDefined,
  areAllTypesCorrect,
  isEmptyBody,
} from "../../lib/validation/common.validation";
import DB from "../../utils/DB/DB";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";

export type UserSubscription = {
  userId: string;
  id: string;
};

export const updateUser = async (db: DB, user: Partial<UserEntity>) => {
  try {
    if (!user.id) throw new Error("id is not provided");
    if (isEmptyBody(user)) throw new Error("Empty body");
    if (
      !(await db.users.findOne({
        key: "id",
        equals: user.id,
      }))
    )
      throw new Error("User not found");
    if (!areAllTypesCorrect(user, "users"))
      throw new Error("Not all fields are of correct types");

    return await db.users.change(user.id, user);
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const updatePost = async (db: DB, post: Partial<PostEntity>) => {
  try {
    if (isEmptyBody(post)) throw new Error("Empty body");
    if (!post.id) throw new Error("id is not provided");

    if (
      !(await db.posts.findOne({
        key: "id",
        equals: post.id,
      }))
    )
      throw new Error("Post not found");
    if (!areAllTypesCorrect(post, "posts"))
      throw new Error("Not all fields are of correct types");
    return await db.posts.change(post.id, post);
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const updateProfile = async (
  db: DB,
  profile: Partial<ProfileEntity>
) => {
  try {
    if (isEmptyBody(profile)) throw new Error("Empty body");
    if (!profile.id) throw new Error("id is not provided");
    if (
      !(await db.profiles.findOne({
        key: "id",
        equals: profile.id,
      }))
    )
      throw new Error("Profile not found");
    if (!areAllTypesCorrect(profile, "profiles"))
      throw new Error("Not all fields are of correct types");
    return await db.profiles.change(profile.id, profile);
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const updateMemberType = async (
  db: DB,
  memberType: Partial<MemberTypeEntity>
) => {
  try {
    if (isEmptyBody(memberType)) throw new Error("Empty body");
    if (!memberType.id) throw new Error("id is not provided");
    if (
      !(await db.memberTypes.findOne({
        key: "id",
        equals: memberType.id,
      }))
    )
      throw new Error("Member-type not found");
    if (!areAllTypesCorrect(memberType, "memberTypes"))
      throw new Error("Not correct types");

    return await db.memberTypes.change(memberType.id, memberType);
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    if (isErrorForbiddenOperation(err)) throw new Error("Forbidden operation");
    throwError(err);
  }
};

export const updateSubscribeTo = async (db: DB, user: UserSubscription) => {
  try {
    const { id, userId } = user;
    if (!areAllFieldsDefined([id, userId]))
      throw new Error("Not all required fields provided");
    if (typeof userId !== "string")
      throw new Error("Not all fields are of correct types");

    if (id === userId) throw new Error("Users ids are the same");

    const userFound = await db.users.findOne({
      key: "id",
      equals: userId,
    });
    const subscriber = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!subscriber || !userFound) throw new Error("user not found");

    const currentSubscribers = userFound?.subscribedToUserIds || [];
    const isAlreadySubscribed = currentSubscribers.includes(id);
    if (isAlreadySubscribed) throw new Error("User is already subscribed");

    currentSubscribers.push(id);
    const changedUser = await db.users.change(userId, {
      subscribedToUserIds: currentSubscribers,
    });

    return changedUser;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const updateUnsubscribeFrom = async (db: DB, user: UserSubscription) => {
  try {
    const { id, userId } = user;

    if (!areAllFieldsDefined([id, userId]))
      throw new Error("Not all required fields provided");
    if (typeof userId !== "string")
      throw new Error("Not all fields are of correct types");

    if (id === userId) throw new Error("Users ids are the same");
    const userFound = await db.users.findOne({
      key: "id",
      equals: userId,
    });

    const subscriber = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!userFound || !subscriber) throw new Error("user not found");

    let currentSubscribers = userFound?.subscribedToUserIds || [];
    const isAlreadySubscribed = currentSubscribers.includes(id);
    if (!isAlreadySubscribed) throw new Error("User is already subscribed");
    currentSubscribers = currentSubscribers.filter((id_) => id_ !== id);
    const changedUser = await db.users.change(userId, {
      subscribedToUserIds: currentSubscribers,
    });

    return changedUser;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};
