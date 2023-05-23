import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../../services/posts/posts.service";
import { HttpError } from "@fastify/sensible/lib/httpError";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return await getPosts(this.db);
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<PostEntity | null | undefined | HttpError | void> {
      const { id } = request.params;
      return await getPostById(this.db, id, reply);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<PostEntity | undefined | HttpError | void> {
      return await createPost(this.db, request.body, reply);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<PostEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await deletePost(this.db, id, reply);
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
    async function (
      request,
      reply
    ): Promise<PostEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await updatePost(this.db, id, request.body, reply);
    }
  );
};

export default plugin;
