import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";
import {
  areAllFieldsDefined,
  areAllTypesCorrect,
  isEmptyBody,
  isValidUuid,
} from "../../lib/validation/common.validation";
import {
  replyBadRequest,
  replyNotFound,
} from "../../lib/errorHandling/replyMessager";
import { isErrorNoRequiredEntity } from "../../lib/errorHandling/errorChecker";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return this.db.posts.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | null | undefined> {
      try {
        const { id } = request.params;
        const postFound = await this.db.posts.findOne({
          key: "id",
          equals: id,
        });
        if (!postFound) replyNotFound(reply, "Post not found");
        return postFound;
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity | undefined> {
      try {
        const { content, title, userId } = request.body;

        if (isEmptyBody(request.body)) replyBadRequest(reply, "Empty body");
        if (!areAllFieldsDefined([content, title, userId]))
          replyBadRequest(reply, "Not all required fields provided");
        if (!isValidUuid(userId))
          replyBadRequest(reply, "User Id is not valid");
        if (!areAllTypesCorrect(request.body, "posts"))
          replyBadRequest(reply, "Not all fields are of correct types");

        return this.db.posts.create({ content, title, userId });
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | undefined> {
      try {
        const { id } = request.params;
        const postFound = await this.db.posts.findOne({
          key: "id",
          equals: id,
        });
        if (!postFound) replyBadRequest(reply, "Post not found");

        return this.db.posts.delete(id);
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | undefined> {
      try {
        const { id } = request.params;

        if (isEmptyBody(request.body)) replyBadRequest(reply, "Empty body");
        if (!areAllTypesCorrect(request.body, "posts"))
          replyBadRequest(reply, "Not all fields are of correct types");

        return this.db.posts.change(id, request.body);
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );
};

export default plugin;
