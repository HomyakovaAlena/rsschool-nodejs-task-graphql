import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  subscribeToUser,
  unsubscribeFromUser,
  updateUser,
} from "../../services/users/users.service";
import { HttpError } from "@fastify/sensible/lib/httpError";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return await getUsers(this.db);
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
    ): Promise<UserEntity | null | undefined | HttpError | void> {
      const { id } = request.params;
      return await getUserById(this.db, id, reply);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<UserEntity | undefined | HttpError | void> {
      return await createUser(this.db, request.body, reply);
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
    ): Promise<UserEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await deleteUser(this.db, id, reply);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<UserEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await subscribeToUser(this.db, id, request.body, reply);
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<UserEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await unsubscribeFromUser(this.db, id, request.body, reply);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<UserEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await updateUser(this.db, id, request.body, reply);
    }
  );
};

export default plugin;
