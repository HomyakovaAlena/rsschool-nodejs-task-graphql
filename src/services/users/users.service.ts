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
import DB from "../../utils/DB/DB";
import { Body } from "../profiles/profiles.service";

export const getUsers = async (db: DB) => {
  return db.users.findMany();
};

export const getUserById = async (db: DB, id: string, reply: FastifyReply) => {
  try {
    const userFound = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!userFound) return replyNotFound(reply, "User not found");
    return userFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const createUser = async (db: DB, body: Body, reply: FastifyReply) => {
  try {
    const { firstName, lastName, email } = body;

    if (!areAllFieldsDefined([firstName, lastName, email]))
      return replyBadRequest(reply, "Not all required fields provided");
    if (!areAllTypesCorrect(body, "users"))
      return replyBadRequest(reply, "Not all fields are of correct types");

    return db.users.create({ firstName, lastName, email });
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const deleteUser = async (db: DB, id: string, reply: FastifyReply) => {
  try {
    if (!id) return replyNotFound(reply, "id is not provided");
    if (
      !(await db.users.findOne({
        key: "id",
        equals: id,
      }))
    )
      return replyBadRequest(reply, "user is not found");

    const usersWithSubscription = await db.users.findMany({
      key: "subscribedToUserIds",
      inArray: id,
    });
    usersWithSubscription.forEach((user) => {
      const correctSubscriptions = user.subscribedToUserIds.filter(
        (_id) => _id !== id
      );
      db.users.change(user.id, {
        subscribedToUserIds: correctSubscriptions,
      });
    });

    const postsOfDeletedUser = await db.posts.findMany({
      key: "userId",
      equals: id,
    });
    postsOfDeletedUser.forEach((post) => {
      db.posts.delete(post.id);
    });

    const profileOfDeletedUser = await db.profiles.findOne({
      key: "userId",
      equals: id,
    });
    if (profileOfDeletedUser) db.profiles.delete(profileOfDeletedUser.id);

    return db.users.delete(id);
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const updateUser = async (
  db: DB,
  id: string,
  body: Body,
  reply: FastifyReply
) => {
  try {
    if (!id) return replyNotFound(reply, "user not found");
    const { firstName, lastName, email } = body;

    if (!areAllTypesCorrect(body, "users"))
      return replyBadRequest(reply, "Not all fields are of correct types");
    if (isEmptyBody(body)) return replyBadRequest(reply, "Empty body");

    return db.users.change(id, { firstName, lastName, email });
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const subscribeToUser = async (
  db: DB,
  id: string,
  body: Body,
  reply: FastifyReply
) => {
  try {
    const { userId } = body;
    if (!areAllFieldsDefined([id, userId]))
      return replyBadRequest(reply, "Not all required fields provided");
    if (typeof userId !== "string")
      return replyBadRequest(reply, "Not all fields are of correct types");

    if (id === userId) return replyBadRequest(reply, "Users ids are the same");

    const user = await db.users.findOne({
      key: "id",
      equals: userId,
    });
    const subscriber = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!subscriber && !user) return replyNotFound(reply, "user not found");

    const currentSubscribers = user?.subscribedToUserIds || [];
    const isAlreadySubscribed = currentSubscribers.includes(id);
    if (isAlreadySubscribed)
      return replyBadRequest(reply, "User is already subscribed");

    currentSubscribers.push(id);
    const changedUser = await db.users.change(userId, {
      subscribedToUserIds: currentSubscribers,
    });

    return changedUser;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const unsubscribeFromUser = async (
  db: DB,
  id: string,
  body: Body,
  reply: FastifyReply
) => {
  try {
    const { userId } = body;

    if (!areAllFieldsDefined([id, userId]))
      return replyBadRequest(reply, "Not all required fields provided");
    if (typeof userId !== "string")
      return replyBadRequest(reply, "Not all fields are of correct types");

    if (id === userId) return replyBadRequest(reply, "Users ids are the same");
    const user = await db.users.findOne({
      key: "id",
      equals: userId,
    });

    const subscriber = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!user || !subscriber) return replyNotFound(reply, "user not found");

    let currentSubscribers = user?.subscribedToUserIds || [];
    const isAlreadySubscribed = currentSubscribers.includes(id);
    if (!isAlreadySubscribed)
      return replyBadRequest(reply, "User is already subscribed");
    currentSubscribers = currentSubscribers.filter((id_) => id_ !== id);
    const changedUser = await db.users.change(userId, {
      subscribedToUserIds: currentSubscribers,
    });

    return changedUser;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};
