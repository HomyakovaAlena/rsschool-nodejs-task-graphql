import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import {
  createProfile,
  deleteProfile,
  getProfileById,
  getProfiles,
  updateProfile,
} from "../../services/profiles/profiles.service";
import { HttpError } from "@fastify/sensible/lib/httpError";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return await getProfiles(this.db);
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
    ): Promise<ProfileEntity | null | undefined | HttpError | void> {
      const id = request.params.id;
      return await getProfileById(this.db, id, reply);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<ProfileEntity | undefined | HttpError | void> {
      return await createProfile(this.db, request.body, reply);
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
    ): Promise<ProfileEntity | undefined | HttpError | void> {
      const id = request.params.id;
      return await deleteProfile(this.db, id, reply);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<ProfileEntity | undefined | HttpError | void> {
      const { id } = request.params;
      return await updateProfile(this.db, id, request.body, reply);
    }
  );
};

export default plugin;
