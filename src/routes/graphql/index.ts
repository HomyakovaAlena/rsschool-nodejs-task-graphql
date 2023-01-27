import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphqlBodySchema } from "./schema";

import { graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getUsers } from "../../services/users/users.service";
import { getPosts } from "../../services/posts/posts.service";
import { getMemberTypes } from "../../services/memberTypes/memberTypes.service";
import { getProfiles } from "../../services/profiles/profiles.service";

import {
  getAll,
  getMemberTypeById,
  getPostById,
  getProfileById,
  getUserById,
  getUserByIdWithSubscribedToUserAndPosts,
  getUsersWithHisSubscriptionsAndProfile,
  getUsersWithRelations,
  getUsersWithSubscriptionsRecursive,
  getUserWithRelations,
} from "../../services/graphql/get.gql.service";

interface Args {
  [key: string]: string;
}

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const typeDefs = `
  schema {
    query: Query
  }

  type Query {
    users: [User],
    posts: [Post],
    profiles: [Profile],
    memberTypes: [MemberType],
    getAll: All,

    user(id: String!): User,
    post(id: String!): Post,
    profile(id: String!): Profile,
    memberType(id: String!): MemberType,

    userWithRelations(id: String!): UserWithRelations
    usersWithRelations: [UserWithRelations],

    usersWithHisSubscriptionsAndProfile: [UserWithHisSubscriptionsAndProfile],
    userByIdWithSubscribedToUserAndPosts(id: String!): UserByIdWithSubscribedToUserAndPosts,
    usersWithSubscriptionsRecursive: [UsersWithSubscriptionsRecursive],
  },

  type Post {
    title: String,
    content: String,
    userId: String,
    id: String!
  },

  type Profile {
    avatar: String,
    sex: String,
    birthday: Int,
    country: String,
    street: String,
    city: String
    userId: String,
    memberTypeId: String,
    id: String!
  },  

  type MemberType {
    discount: Int,
    monthPostsLimit: Int,
    id: String!
  },  

  type User {
    firstName: String,
    lastName: String,
    email: String,
    id: String!
  },  

  type All {
    users: [User],
    profiles: [Profile],
    posts: [Post],
    memberTypes: [MemberType]
  },  

  type UserWithRelations {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    posts: [Post],
    profile: Profile,
    memberType: MemberType
  }, 

  type UserWithHisSubscriptionsAndProfile {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [User],
    profile: Profile
  },

  type UserByIdWithSubscribedToUserAndPosts {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    subscribedToUser: [User],
    posts: [Post]   
  }

  type UsersWithSubscriptionsRecursive {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [UsersWithSubscriptions],
    subscribedToUser: [UsersWithSubscriptions]
  }, 

  type UsersWithSubscriptions {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [User],
    subscribedToUser: [User]
  }, 
`;

  const resolvers = {
    Query: {
      users: async () => await getUsers(fastify.db),
      posts: async () => await getPosts(fastify.db),
      memberTypes: async () => await getMemberTypes(fastify.db),
      profiles: async () => await getProfiles(fastify.db),
      getAll: async () => await getAll(fastify.db),
      user: async (_: any, args: Args) => {
        return await getUserById(fastify.db, args.id);
      },
      post: async (_: any, args: Args) => {
        return await getPostById(fastify.db, args.id);
      },
      memberType: async (_: any, args: Args) => {
        return await getMemberTypeById(fastify.db, args.id);
      },
      profile: async (_: any, args: Args) => {
        return await getProfileById(fastify.db, args.id);
      },

      usersWithRelations: async () => {
        return await getUsersWithRelations(fastify.db);
      },
      userWithRelations: async (_: any, args: Args) => {
        return await getUserWithRelations(fastify.db, args.id);
      },

      usersWithHisSubscriptionsAndProfile: async () => {
        return await getUsersWithHisSubscriptionsAndProfile(fastify.db);
      },

      userByIdWithSubscribedToUserAndPosts: async (_: any, args: Args) => {
        return await getUserByIdWithSubscribedToUserAndPosts(
          fastify.db,
          args.id
        );
      },

      usersWithSubscriptionsRecursive: async (_: any, args: Args) => {
        return await getUsersWithSubscriptionsRecursive(fastify.db);
      },
    },
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      console.log(String(request.body));
      const response = await graphql({
        schema: schema,
        source: String(request.body.query),
        contextValue: reply,
      });
      console.log(response);
      return response;
    }
  );
};

export default plugin;
