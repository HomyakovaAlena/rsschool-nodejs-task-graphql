import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { Args, Context, Info } from "../graphql/resolvers";
import { getProfiles } from "./profiles.service";

export const getProfilesByIds = async (db: DB, ids: string[]) => {
  const profiles = await getProfiles(db);
  return profiles.filter((profile) => ids.includes(profile.id));
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
      const rows = await getProfilesByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(info.fieldNodes, dl);
  }
  return dl.load(args.id);
};
