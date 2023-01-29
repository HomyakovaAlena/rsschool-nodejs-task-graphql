import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { Args, Context, Info } from "../graphql/resolvers";
import { getPosts } from "./posts.service";

export const getPostsByIds = async (db: DB, ids: string[]) => {
  const posts = await getPosts(db);
  return posts.filter((post) => ids.includes(post.id));
};

export const getProfileByIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  let dl = dataloaders.get(info.fieldNodes);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getPostsByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(info.fieldNodes, dl);
  }
  return dl.load(args.id);
};
