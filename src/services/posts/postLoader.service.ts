import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { Args, Context, Info } from "../graphql/resolvers";
import { getPosts } from "./posts.service";

export const getPostsByIds = async (db: DB, ids: string[]) => {
  const posts = await getPosts(db);
  return posts.filter((post) => ids.includes(post.id));
};

export const getPostsByUserIds = async (db: DB, userIds: string[]) => {
  const posts = await getPosts(db);
  return posts.filter((post) => userIds.includes(post.userId));
};

export const getPostByIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  const objKey = {
    func: getPostByIdWithBatching.name,
    ...info.fieldNodes,
  };
  let dl = dataloaders.get(objKey);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getPostsByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(objKey, dl);
  }
  return dl.load(args.id);
};

export const getPostsByUserIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  const objKey = {
    func: getPostsByUserIdWithBatching.name,
    ...info.fieldNodes,
  };
  let dl = dataloaders.get(objKey);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getPostsByUserIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.userId === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(objKey, dl);
  }
  return dl.load(args.id);
};
