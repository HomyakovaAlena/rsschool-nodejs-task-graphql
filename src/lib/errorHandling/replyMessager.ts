import fastify, { FastifyReply } from "fastify";
fastify();

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

// export const replyNotFound = (message: string = "Not Found") => {
//   return fastify().httpErrors.notFound(message);
// };

// export const replyBadRequest = (message: string = "Bad Request") => {
//   return fastify().httpErrors.badRequest(message);
// };

// export const replyForbidden = (message: string = "Forbidden") => {
//   return fastify().httpErrors.forbidden(message);
// };
