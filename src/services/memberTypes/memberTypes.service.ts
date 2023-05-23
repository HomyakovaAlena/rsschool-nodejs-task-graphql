import { FastifyReply } from "fastify";
import {
  isErrorForbiddenOperation,
  isErrorNoRequiredEntity,
} from "../../lib/errorHandling/errorChecker";
import {
  replyBadRequest,
  replyForbidden,
  replyNotFound,
} from "../../lib/errorHandling/replyMessager";
import {
  areAllTypesCorrect,
  isEmptyBody,
  isFieldDefined,
} from "../../lib/validation/common.validation";
import DB from "../../utils/DB/DB";

export const getMemberTypes = async (db: DB) => {
  const membersFound = await db.memberTypes.findMany();
  return membersFound;
};

export const getMemberTypeById = async (
  db: DB,
  id: string,
  reply: FastifyReply
) => {
  try {
    const memberFound = await db.memberTypes.findOne({
      key: "id",
      equals: id,
    });

    if (!isFieldDefined(memberFound)) {
      return replyNotFound(reply, "Member-type not found");
    }

    return memberFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
  }
};

export const updateMemberType = async (
  db: DB,
  id: string,
  body: Object,
  reply: FastifyReply
) => {
  try {
    if (isEmptyBody(body)) return replyBadRequest(reply, "Empty body");
    if (!areAllTypesCorrect(body, "memberTypes"))
      return replyBadRequest(reply, "Not correct types");
    if (
      !(await db.memberTypes.findOne({
        key: "id",
        equals: id,
      }))
    )
      return replyBadRequest(reply, "Member-type not found");

    const memberToUpdate = await db.memberTypes.change(id, body);
    return memberToUpdate;
  } catch (err) {
    if (isErrorNoRequiredEntity(err))
      return replyNotFound(reply, "No required entity");
    if (isErrorForbiddenOperation(err))
      return replyForbidden(reply, "Forbidden operation");
  }
};
