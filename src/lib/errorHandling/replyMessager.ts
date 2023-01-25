import { FastifyReply } from "fastify";

export enum Messages {
  NotFound = "Not Found",
}

export const replyNotFound = (
  reply: FastifyReply,
  message: string = "Not Found"
) => reply.notFound(message);

export const replyBadRequest = (
  reply: FastifyReply,
  message: string = "Bad Request"
) => reply.badRequest(message);

export const replyForbidden = (
  reply: FastifyReply,
  message: string = "Forbidden"
) => reply.forbidden(message);
