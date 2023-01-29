import {
  isErrorNoRequiredEntity,
  throwError,
} from "../../lib/errorHandling/errorChecker";
import { isFieldDefined } from "../../lib/validation/common.validation";
import DB from "../../utils/DB/DB";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { getMemberTypes } from "../memberTypes/memberTypes.service";
import { getPosts } from "../posts/posts.service";
import { getProfiles } from "../profiles/profiles.service";
import { getUsers } from "../users/users.service";

type UserWithRelations = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  posts: PostEntity[] | null;
  profile: ProfileEntity | null;
  memberType: string | null;
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
  // return await getMemberTypeByIdWithBatching(args, context, info);
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

export const getPostById = async (db: DB, id: string) => {
  try {
    const postFound = await db.posts.findOne({
      key: "id",
      equals: id,
    });
    if (!postFound) throw new Error("Post not found");
    return postFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getProfileById = async (db: DB, id: string) => {
  try {
    const profileFound = await db.profiles.findOne({
      key: "id",
      equals: id,
    });
    if (!profileFound) throw new Error("Profile not found");

    return profileFound;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUserById = async (db: DB, id: string) => {
  try {
    const userFound = await db.users.findOne({
      key: "id",
      equals: id,
    });
    if (!userFound) throw new Error("User not found");
    return userFound;
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

export const getProfileByUserId = async (db: DB, id: string) => {
  return await db.profiles.findOne({
    key: "userId",
    equals: id,
  });
};

export const getMemberTypeByUserId = async (db: DB, id: string) => {
  const profile = await db.profiles.findOne({
    key: "userId",
    equals: id,
  });
  return profile?.memberTypeId || null;
};

export const getUsersWithRelations = async (db: DB) => {
  try {
    const usersFound = await getUsers(db);
    const usersWithRelations: UserWithRelations[] = [];
    for (const user of usersFound) {
      usersWithRelations.push({
        posts: await getPostsByUserId(db, user.id),
        profile: await getProfileByUserId(db, user.id),
        memberType: await getMemberTypeByUserId(db, user.id),
        ...user,
      });
    }
    return usersWithRelations;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUserWithRelations = async (db: DB, id: string) => {
  try {
    const userFound = await getUserById(db, id);
    if (!userFound) throw new Error("user not found");
    const userWithRelations = {
      posts: await getPostsByUserId(db, userFound.id),
      profile: await getProfileByUserId(db, userFound.id),
      memberType: await getMemberTypeByUserId(db, userFound.id),
      ...userFound,
    };
    return userWithRelations;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersWithRelationsArrayById = async (
  db: DB,
  idArray: string[]
) => {
  try {
    const usersWithRelations: UserWithRelations[] = [];
    for (const id of idArray) {
      const userFound = await getUserById(db, id);
      if (userFound !== undefined) {
        const userWithRelations = {
          posts: await getPostsByUserId(db, userFound.id),
          profile: await getProfileByUserId(db, userFound.id),
          memberType: await getMemberTypeByUserId(db, userFound.id),
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
    const filteredUsers = usersFound.filter((user) => {
      user.subscribedToUserIds.includes(id);
    });
    return filteredUsers;
  } catch (err) {
    if (isErrorNoRequiredEntity(err)) throw new Error("No required entity");
    throwError(err);
  }
};

export const getUsersWithHisSubscriptionsAndProfile = async (db: DB) => {
  try {
    const usersFound = await getUsers(db);
    const usersWithHisSubscriptionsAndProfile: UserWithHisSubscriptionsAndProfile[] =
      [];
    for (const user of usersFound) {
      usersWithHisSubscriptionsAndProfile.push({
        profile: await getProfileByUserId(db, user.id),
        userSubscribedTo: (await getCurrentUserSubscribedTo(db, user.id)) || [],
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
  db: DB,
  id: string
) => {
  try {
    const userFound = await getUserById(db, id);
    if (!userFound) throw new Error("user not found");
    const userWithSubscribersAndPosts = {
      posts: await getPostsByUserId(db, userFound.id),
      subscribedToUser: await getUsersArrayById(
        db,
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
