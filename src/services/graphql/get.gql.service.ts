import {
  isErrorNoRequiredEntity,
  throwError,
} from "../../lib/errorHandling/errorChecker";
import { isFieldDefined } from "../../lib/validation/common.validation";
import DB from "../../utils/DB/DB";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { getMemberTypes } from "../memberTypes/memberTypes.service";
import { getPosts } from "../posts/posts.service";
import { getProfileByUserIdWithBatching } from "../profiles/profileLoader.service";
import { getProfiles } from "../profiles/profiles.service";
import { getUserByIdWithBatching } from "../users/userLoader.service";
import { getUsers } from "../users/users.service";
import { Args, Context, Info } from "./resolvers";

type UserWithRelations = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  posts: PostEntity[] | null;
  profile: ProfileEntity | null;
  memberType: MemberTypeEntity | null;
};

export type UserWithSubscriptionsRecursive = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  userSubscribedTo?: UserWithSubscriptionsRecursive[];
  subscribedToUser?: UserWithSubscriptionsRecursive[];
};

type UserWithHisSubscriptionsAndProfile = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  profile: ProfileEntity | null;
  userSubscribedTo: UserEntity[];
};

export const getAll = async (db: DB) => {
  const users = await getUsers(db);
  const profiles = await getProfiles(db);
  const posts = await getPosts(db);
  const memberTypes = await getMemberTypes(db);
  return { users, profiles, posts, memberTypes };
};

export const getMemberTypeById = async (db: DB, id: string) => {
  try {
    const memberFound = await db.memberTypes.findOne({
      key: "id",
      equals: id,
    });
    if (!isFieldDefined(memberFound)) {
      throw new Error("Member-type not found");
    }
    return memberFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getPostsByUserId = async (db: DB, id: string) => {
  return await db.posts.findMany({
    key: "userId",
    equals: id,
  });
};

export const getMemberTypeByUserId = async (db: DB, id: string) => {
  const profile = await db.profiles.findOne({
    key: "userId",
    equals: id,
  });
  return profile?.memberTypeId || "";
};

export const getUsersWithRelations = async (
  args: Args,
  context: Context,
  info: Info
) => {
  try {
    const usersFound = await getUsers(context.db);
    const usersWithRelations: UserWithRelations[] = [];
    for (const user of usersFound) {
      const argsForBatching: Args = {};
      argsForBatching.id = user.id;
      const profile = await getProfileByUserIdWithBatching(
        argsForBatching,
        context,
        info
      );

      const memberType = profile
        ? await getMemberTypeById(context.db, profile?.memberTypeId)
        : null;

      usersWithRelations.push({
        posts: await getPostsByUserId(context.db, user.id),
        profile: profile,
        memberType: memberType || null,
        ...user,
      });
    }
    return usersWithRelations;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUserWithRelations = async (
  args: Args,
  context: Context,
  info: Info
) => {
  try {
    const userFound = await getUserByIdWithBatching(args, context, info);
    if (!userFound) throw new Error("user not found");
    const argsForBatching: Args = {};
    argsForBatching.id = userFound.id;
    const profile = await getProfileByUserIdWithBatching(
      argsForBatching,
      context,
      info
    );

    const memberType = profile
      ? await getMemberTypeById(context.db, profile?.memberTypeId)
      : null;
    const userWithRelations = {
      posts: await getPostsByUserId(context.db, userFound.id),
      profile: profile,
      memberType: memberType,
      ...userFound,
    };
    return userWithRelations;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersWithRelationsArrayById = async (
  args: Args,
  context: Context,
  info: Info
) => {
  try {
    const usersWithRelations: UserWithRelations[] = [];
    for (const id of args.idArray) {
      const argsWithSingleId: Args = {};
      argsWithSingleId.id = id;
      const userFound = await getUserByIdWithBatching(
        argsWithSingleId,
        context,
        info
      );
      const profile = await getProfileByUserIdWithBatching(
        argsWithSingleId,
        context,
        info
      );

      const memberType = profile
        ? await getMemberTypeById(context.db, profile?.memberTypeId)
        : null;

      if (userFound !== undefined) {
        const userWithRelations = {
          posts: await getPostsByUserId(context.db, userFound.id),
          profile: await getProfileByUserIdWithBatching(
            argsWithSingleId,
            context,
            info
          ),
          memberType: memberType,
          ...userFound,
        };
        usersWithRelations.push(userWithRelations);
      }
    }
    return usersWithRelations;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersArrayById = async (db: DB, idArray: string[]) => {
  const users = await getUsers(db);
  return users.filter((user) => idArray.includes(user.id));
};

export const getCurrentUserSubscribedTo = async (db: DB, id: string) => {
  try {
    const usersFound = await getUsers(db);
    const filteredUsers = usersFound.filter((user) =>
      user.subscribedToUserIds.includes(id)
    );
    return filteredUsers;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersWithHisSubscriptionsAndProfile = async (
  args: Args,
  context: Context,
  info: Info
) => {
  try {
    const usersFound = await getUsers(context.db);
    const usersWithHisSubscriptionsAndProfile: UserWithHisSubscriptionsAndProfile[] =
      [];
    for (const user of usersFound) {
      const argsForBatching: Args = {};
      argsForBatching.id = user.id;
      usersWithHisSubscriptionsAndProfile.push({
        profile: await getProfileByUserIdWithBatching(
          argsForBatching,
          context,
          info
        ),
        userSubscribedTo:
          (await getCurrentUserSubscribedTo(context.db, user.id)) || [],
        ...user,
      });
    }
    return usersWithHisSubscriptionsAndProfile;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUserByIdWithSubscribedToUserAndPosts = async (
  args: Args,
  context: Context,
  info: Info
) => {
  try {
    const userFound = await getUserByIdWithBatching(args, context, info);
    if (!userFound) throw new Error("user not found");
    const userWithSubscribersAndPosts = {
      posts: await getPostsByUserId(context.db, userFound.id),
      subscribedToUser: await getUsersArrayById(
        context.db,
        userFound.subscribedToUserIds
      ),
      ...userFound,
    };
    return userWithSubscribersAndPosts;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersSubscriptions = async (
  db: DB,
  usersArray: UserEntity[]
) => {
  try {
    const usersWithSubscriptionsRecursive: UserWithSubscriptionsRecursive[] =
      [];
    for (const user of usersArray) {
      const userSubscribedTo =
        (await getCurrentUserSubscribedTo(db, user.id)) || [];
      const subscribedToUser = await getUsersArrayById(
        db,
        user.subscribedToUserIds
      );
      usersWithSubscriptionsRecursive.push({
        userSubscribedTo,
        subscribedToUser,
        ...user,
      });
      return usersWithSubscriptionsRecursive;
    }
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersWithSubscriptionsRecursive = async (db: DB) => {
  try {
    const usersFound = await getUsers(db);
    const usersWithSubscriptionsRecursive: UserWithSubscriptionsRecursive[] =
      [];
    for (const user of usersFound) {
      const simpleUserSubscribedTo =
        (await getCurrentUserSubscribedTo(db, user.id)) || [];
      const simpleSubscribedToUser = await getUsersArrayById(
        db,
        user.subscribedToUserIds
      );
      const userSubscribedTo = await getUsersSubscriptions(
        db,
        simpleUserSubscribedTo
      );
      const subscribedToUser = await getUsersSubscriptions(
        db,
        simpleSubscribedToUser
      );
      usersWithSubscriptionsRecursive.push({
        userSubscribedTo,
        subscribedToUser,
        ...user,
      });
    }
    return usersWithSubscriptionsRecursive;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};
