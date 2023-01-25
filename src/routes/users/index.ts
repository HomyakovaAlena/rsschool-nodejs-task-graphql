import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";
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

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return this.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null | undefined> {
      try {
        const { id } = request.params;
        const userFound = await this.db.users.findOne({
          key: "id",
          equals: id,
        });
        if (!userFound) replyNotFound(reply, "User not found");
        return userFound;
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
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const { firstName, lastName, email } = request.body;

        if (!areAllFieldsDefined([firstName, lastName, email]))
          replyBadRequest(reply, "Not all required fields provided");
        if (!areAllTypesCorrect(request.body, "users"))
          replyBadRequest(reply, "Not all fields are of correct types");

        return this.db.users.create({ firstName, lastName, email });
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
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const { id } = request.params;
        if (!id) replyNotFound(reply, "id is not provided");
        if (
          !(await this.db.users.findOne({
            key: "id",
            equals: id,
          }))
        )
          replyBadRequest(reply, "user is not found");

        const usersWithSubscription = await this.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: id,
        });
        usersWithSubscription.forEach((user) => {
          const correctSubscriptions = user.subscribedToUserIds.filter(
            (_id) => _id !== id
          );
          this.db.users.change(user.id, {
            subscribedToUserIds: correctSubscriptions,
          });
        });

        const postsOfDeletedUser = await this.db.posts.findMany({
          key: "userId",
          equals: id,
        });
        postsOfDeletedUser.forEach((post) => {
          this.db.posts.delete(post.id);
        });

        const profileOfDeletedUser = await this.db.profiles.findOne({
          key: "userId",
          equals: id,
        });
        if (profileOfDeletedUser)
          this.db.profiles.delete(profileOfDeletedUser.id);

        return this.db.users.delete(id);
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
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
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const { id } = request.params;
        const { userId } = request.body;
        if (!areAllFieldsDefined([id, userId]))
          replyBadRequest(reply, "Not all required fields provided");
        if (typeof userId !== "string")
          replyBadRequest(reply, "Not all fields are of correct types");

        if (id === userId) replyBadRequest(reply, "Users ids are the same");

        const user = await this.db.users.findOne({
          key: "id",
          equals: userId,
        });
        const subscriber = await this.db.users.findOne({
          key: "id",
          equals: id,
        });
        if (!subscriber && !user) replyNotFound(reply, "user not found");

        const currentSubscribers = user?.subscribedToUserIds || [];
        const isAlreadySubscribed = currentSubscribers.includes(id);
        if (isAlreadySubscribed)
          replyBadRequest(reply, "User is already subscribed");

        currentSubscribers.push(id);
        const changedUser = await this.db.users.change(userId, {
          subscribedToUserIds: currentSubscribers,
        });

        return changedUser;
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
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
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const { id } = request.params;
        const { userId } = request.body;

        if (!areAllFieldsDefined([id, userId]))
          replyBadRequest(reply, "Not all required fields provided");
        if (typeof userId !== "string")
          replyBadRequest(reply, "Not all fields are of correct types");

        if (id === userId) replyBadRequest(reply, "Users ids are the same");
        const user = await this.db.users.findOne({
          key: "id",
          equals: userId,
        });

        const subscriber = await this.db.users.findOne({
          key: "id",
          equals: id,
        });
        if (!user || !subscriber) replyNotFound(reply, "user not found");

        let currentSubscribers = user?.subscribedToUserIds || [];
        const isAlreadySubscribed = currentSubscribers.includes(id);
        if (!isAlreadySubscribed)
          replyBadRequest(reply, "User is already subscribed");
        currentSubscribers = currentSubscribers.filter((id_) => id_ !== id);
        const changedUser = await this.db.users.change(userId, {
          subscribedToUserIds: currentSubscribers,
        });

        return changedUser;
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
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const { id } = request.params;
        if (!id) reply.notFound();
        const { firstName, lastName, email } = request.body;

        if (!areAllTypesCorrect(request.body, "users"))
          replyBadRequest(reply, "Not all fields are of correct types");
        if (isEmptyBody(request.body)) replyBadRequest(reply, "Empty body");

        return this.db.users.change(id, { firstName, lastName, email });
      } catch (err) {
        if (isErrorNoRequiredEntity(err))
          replyNotFound(reply, "No required entity");
      }
    }
  );
};

export default plugin;
