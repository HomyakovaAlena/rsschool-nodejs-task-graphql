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

interface Args {
  [key: string]: string;
}

export const root = {
  users: async (_: any, db: DB) => {
    return await getUsers(db);
  },
  posts: async (_: Args, db: DB) => await getPosts(db),
  memberTypes: async (_: Args, db: DB) => await getMemberTypes(db),
  profiles: async (_: Args, db: DB) => await getProfiles(db),
  getAll: async (_: Args, db: DB) => await getAll(db),
  user: async (args: Args, db: DB) => {
    return await getUserById(db, args.id);
  },
  post: async (args: Args, db: DB) => {
    return await getPostById(db, args.id);
  },
  memberType: async (args: Args, db: DB) => {
    return await getMemberTypeById(db, args.id);
  },
  profile: async (args: Args, db: DB) => {
    return await getProfileById(db, args.id);
  },

  usersWithRelations: async (_: Args, db: DB) => {
    return await getUsersWithRelations(db);
  },
  userWithRelations: async (args: Args, db: DB) => {
    return await getUserWithRelations(db, args.id);
  },

  usersWithHisSubscriptionsAndProfile: async (_: Args, db: DB) => {
    return await getUsersWithHisSubscriptionsAndProfile(db);
  },

  userByIdWithSubscribedToUserAndPosts: async (args: Args, db: DB) => {
    return await getUserByIdWithSubscribedToUserAndPosts(db, args.id);
  },

  usersWithSubscriptionsRecursive: async (_: Args, db: DB) => {
    return await getUsersWithSubscriptionsRecursive(db);
  },

  createUser: async (args: { input: CreateUserDTO }, db: DB) => {
    return await createUser(db, Object.values(args)[0]);
  },
  createProfile: async (args: { input: CreateProfileDTO }, db: DB) => {
    return await createProfile(db, Object.values(args)[0]);
  },
  createPost: async (args: { input: CreatePostDTO }, db: DB) => {
    return await createPost(db, Object.values(args)[0]);
  },
  updateUser: async (args: { input: Partial<UserEntity> }, db: DB) => {
    return await updateUser(db, args.input);
  },
  updateProfile: async (args: { input: Partial<ProfileEntity> }, db: DB) => {
    return await updateProfile(db, args.input);
  },
  updatePost: async (args: { input: Partial<PostEntity> }, db: DB) => {
    return await updatePost(db, args.input);
  },
  updateMemberType: async (
    args: { input: Partial<MemberTypeEntity> },
    db: DB
  ) => {
    return await updateMemberType(db, args.input);
  },

  updateSubscribeTo: async (args: { input: UserSubscription }, db: DB) => {
    return await updateSubscribeTo(db, args.input);
  },
  updateUnsubscribeFrom: async (args: { input: UserSubscription }, db: DB) => {
    return await updateUnsubscribeFrom(db, args.input);
  },
};
