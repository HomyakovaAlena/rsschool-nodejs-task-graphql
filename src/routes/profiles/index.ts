import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import {
  areAllFieldsDefined,
  areAllTypesCorrect,
  isEmptyBody,
} from "../../lib/validation/common.validation";
import {
  replyBadRequest,
  replyNotFound,
} from "../../lib/errorHandling/replyMessager";
import { isErrorNoRequiredEntity } from "../../lib/errorHandling/errorChecker";
import { isValidMemberType } from "../../lib/validation/member-types.validation";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return this.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | null | undefined> {
      try {
        const id = request.params.id;
        const profileFound = await this.db.profiles.findOne({
          key: "id",
          equals: id,
        });
        if (!profileFound) replyNotFound(reply, "Profile not found");

        return profileFound;
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
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | undefined> {
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
        } = request.body;

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
          replyBadRequest(reply, "Not all required fields provided");
        if (!areAllTypesCorrect(request.body, "profiles"))
          replyBadRequest(reply, "Not all fields are of correct types");
        if (!isValidMemberType(memberTypeId))
          replyBadRequest(reply, "Not valid member-type");
        if (!(await this.db.users.findOne({ key: "id", equals: userId })))
          replyBadRequest(reply, "User not found");
        if (await this.db.profiles.findOne({ key: "userId", equals: userId }))
          replyBadRequest(reply, "Profile has been already created");

        return this.db.profiles.create(request.body);
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
    async function (request, reply): Promise<ProfileEntity | undefined> {
      try {
        const id = request.params.id;
        if (
          !(await this.db.profiles.findOne({
            key: "id",
            equals: id,
          }))
        )
          replyBadRequest(reply, "Profile not found");

        return this.db.profiles.delete(id);
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
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | undefined> {
      try {
        const { id } = request.params;

        if (!areAllTypesCorrect(request.body, "profiles"))
          replyBadRequest(reply, "Not all fields are of correct types");

        if (isEmptyBody(request.body)) replyBadRequest(reply, "Empty body");
        const correctedProfile = await this.db.profiles.change(
          id,
          request.body
        );
        return correctedProfile;
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );
};

export default plugin;
