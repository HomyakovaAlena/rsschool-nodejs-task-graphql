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
  // isFieldDefined,
  isValidUuid,
} from "../../lib/validation/common.validation";
import DB from "../../utils/DB/DB";

type Body = {
  [key: string]: any;
};

export const getPosts = async (db: DB) => {
  return db.posts.findMany();
};

export const getPostById = async (db: DB, id: string, reply: FastifyReply) => {
  try {
    const postFound = await db.posts.findOne({
      key: "id",
      equals: id,
    });
    if (!postFound) return replyNotFound(reply, "Post not found");
    return postFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const createPost = async (db: DB, body: Body, reply: FastifyReply) => {
  const { content, title, userId } = body;
  try {
    if (isEmptyBody(body)) return replyBadRequest(reply, "Empty body");
    if (!areAllFieldsDefined([content, title, userId]))
      return replyBadRequest(reply, "Not all required fields provided");
    if (!isValidUuid(userId))
      return replyBadRequest(reply, "User Id is not valid");
    if (!areAllTypesCorrect(body, "posts"))
      return replyBadRequest(reply, "Not all fields are of correct types");

    return db.posts.create({ content, title, userId });
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const deletePost = async (db: DB, id: string, reply: FastifyReply) => {
  try {
    const postFound = await db.posts.findOne({
      key: "id",
      equals: id,
    });
    if (!postFound) return replyBadRequest(reply, "Post not found");

    return db.posts.delete(id);
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const updatePost = async (
  db: DB,
  id: string,
  body: Body,
  reply: FastifyReply
) => {
  try {
    if (isEmptyBody(body)) return replyBadRequest(reply, "Empty body");
    if (!areAllTypesCorrect(body, "posts"))
      return replyBadRequest(reply, "Not all fields are of correct types");

    return db.posts.change(id, body);
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};
