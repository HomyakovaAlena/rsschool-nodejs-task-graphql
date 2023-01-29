import { getUsers } from "../../services/users/users.service";
import { getPosts } from "../../services/posts/posts.service";
import { getMemberTypes } from "../../services/memberTypes/memberTypes.service";
import { getProfiles } from "../../services/profiles/profiles.service";
import {
  getAll,
  // getMemberTypeById,
  // getPostById,
  // getProfileById,
  // getUserById,
  getUserByIdWithSubscribedToUserAndPosts,
  getUsersWithHisSubscriptionsAndProfile,
  getUsersWithRelations,
  getUsersWithSubscriptionsRecursive,
  getUserWithRelations,
} from "../../services/graphql/get.gql.service";
import {
  createPost,
  createProfile,
  createUser,
} from "../../services/graphql/create.gql.service";
import { CreatePostDTO, PostEntity } from "../../utils/DB/entities/DBPosts";
import {
  CreateProfileDTO,
  ProfileEntity,
} from "../../utils/DB/entities/DBProfiles";
import { CreateUserDTO, UserEntity } from "../../utils/DB/entities/DBUsers";
import {
  updateMemberType,
  updatePost,
  updateProfile,
  updateSubscribeTo,
  updateUnsubscribeFrom,
  updateUser,
  UserSubscription,
} from "../../services/graphql/update.gql.service";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

import DB from "../../utils/DB/DB";
// import * as DataLoader from "dataloader";
import {
  getUserByIdWithBatching,
  // getUsersByIds,
} from "../users/userLoader.service";
// import { getPostsByIds } from "../posts/postLoader.service";
import { getMemberTypeByIdWithBatching } from "../memberTypes/memberTypeLoader.service";
import {
  getProfileByIdWithBatching,
  // getProfilesByIds,
} from "../profiles/profileLoader.service";

export interface Args {
  [key: string]: string;
}

export interface Context {
  db: DB;
  dataloaders: WeakMap<object, any>;
}

export interface Info {
  fieldNodes: WeakMap<object, any>;
}

export const root = {
  users: async (_: any, context: Context, info: Info) => {
    return await getUsers(context.db);
  },
  posts: async (_: Args, context: Context, info: Info) => {
    return await getPosts(context.db);
  },
  memberTypes: async (_: Args, context: Context, info: Info) =>
    await getMemberTypes(context.db),
  profiles: async (_: Args, context: Context, info: Info) =>
    await getProfiles(context.db),
  getAll: async (_: Args, context: Context, info: Info) =>
    await getAll(context.db),
  
  user: async (args: Args, context: Context, info: Info) => {
    return await getUserByIdWithBatching(args, context, info);
    // return await getUserById(context.db, args.id);
  },
  post: async (args: Args, context: Context, info: Info) => {
    return await getProfileByIdWithBatching(args, context, info);
    // return await getPostById(context.db, args.id);
  },
  memberType: async (args: Args, context: Context, info: Info) => {
    return await getMemberTypeByIdWithBatching(args, context, info);
    // return await getMemberTypeById(context.db, args.id);
  },
  profile: async (args: Args, context: Context, info: Info) => {
    return await getProfileByIdWithBatching(args, context, info);
    // return await getProfileById(context.db, args.id);
  },

  usersWithRelations: async (_: Args, context: Context, info: Info) => {
    return await getUsersWithRelations(context.db);
  },
  userWithRelations: async (args: Args, context: Context, info: Info) => {
    return await getUserWithRelations(context.db, args.id);
  },

  usersWithHisSubscriptionsAndProfile: async (
    _: Args,
    context: Context,
    info: Info
  ) => {
    return await getUsersWithHisSubscriptionsAndProfile(context.db);
  },

  userByIdWithSubscribedToUserAndPosts: async (
    args: Args,
    context: Context,
    info: Info
  ) => {
    return await getUserByIdWithSubscribedToUserAndPosts(context.db, args.id);
  },

  usersWithSubscriptionsRecursive: async (
    _: Args,
    context: Context,
    info: Info
  ) => {
    return await getUsersWithSubscriptionsRecursive(context.db);
  },

  createUser: async (
    args: { input: CreateUserDTO },
    context: Context,
    info: Info
  ) => {
    return await createUser(context.db, Object.values(args)[0]);
  },
  createProfile: async (
    args: { input: CreateProfileDTO },
    context: Context,
    info: Info
  ) => {
    return await createProfile(context.db, Object.values(args)[0]);
  },
  createPost: async (
    args: { input: CreatePostDTO },
    context: Context,
    info: Info
  ) => {
    return await createPost(context.db, Object.values(args)[0]);
  },
  updateUser: async (
    args: { input: Partial<UserEntity> },
    context: Context,
    info: Info
  ) => {
    return await updateUser(context.db, args.input);
  },
  updateProfile: async (
    args: { input: Partial<ProfileEntity> },
    context: Context,
    info: Info
  ) => {
    return await updateProfile(context.db, args.input);
  },
  updatePost: async (
    args: { input: Partial<PostEntity> },
    context: Context,
    info: Info
  ) => {
    return await updatePost(context.db, args.input);
  },
  updateMemberType: async (
    args: { input: Partial<MemberTypeEntity> },
    context: Context,
    info: Info
  ) => {
    return await updateMemberType(context.db, args.input);
  },

  updateSubscribeTo: async (
    args: { input: UserSubscription },
    context: Context,
    info: Info
  ) => {
    return await updateSubscribeTo(context.db, args.input);
  },
  updateUnsubscribeFrom: async (
    args: { input: UserSubscription },
    context: Context,
    info: Info
  ) => {
    return await updateUnsubscribeFrom(context.db, args.input);
  },
};
