import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import {
  updateMemberType,
  getMemberTypeById,
  getMemberTypes,
} from "../../services/memberTypes/memberTypes.service";
import { HttpError } from "@fastify/sensible/lib/httpError";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await getMemberTypes(this.db);
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
    ): Promise<MemberTypeEntity | null | undefined | HttpError | void> {
      const { id } = request.params;
      return await getMemberTypeById(this.db, id, reply);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      request,
      reply
    ): Promise<MemberTypeEntity | undefined | HttpError | void> {
      const { id } = request.params;
      const { body } = request;
      return await updateMemberType(this.db, id, body, reply);
    }
  );
};

export default plugin;
