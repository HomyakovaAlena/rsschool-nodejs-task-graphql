import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import {
  areAllTypesCorrect,
  isEmptyBody,
  isFieldDefined,
} from "../../lib/validation/common.validation";
import {
  replyBadRequest,
  replyForbidden,
  replyNotFound,
} from "../../lib/errorHandling/replyMessager";
import {
  isErrorForbiddenOperation,
  isErrorNoRequiredEntity,
} from "../../lib/errorHandling/errorChecker";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const membersFound = await this.db.memberTypes.findMany();
    return membersFound;
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
    ): Promise<MemberTypeEntity | null | undefined> {
      try {
        const { id } = request.params;
        const memberFound = await this.db.memberTypes.findOne({
          key: "id",
          equals: id,
        });

        if (!isFieldDefined(memberFound))
          replyNotFound(reply, "Member-type not found");

        return memberFound;
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
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | undefined> {
      try {
        const { id } = request.params;
        const { body } = request;

        if (isEmptyBody(body)) replyBadRequest(reply, "Empty body");
        if (!areAllTypesCorrect(body, "memberTypes"))
          replyBadRequest(reply, "Not correct types");
        if (
          !(await this.db.memberTypes.findOne({
            key: "id",
            equals: id,
          }))
        )
          replyBadRequest(reply, "Member-type not found");

        const memberToUpdate = await this.db.memberTypes.change(id, body);
        return memberToUpdate;
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
        if (isErrorForbiddenOperation(err))
          replyForbidden(reply, "Forbidden operation");
      }
    }
  );
};

export default plugin;
