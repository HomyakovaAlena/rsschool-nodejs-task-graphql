import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { Args, Context, Info } from "../graphql/resolvers";
import { getProfiles } from "../profiles/profiles.service";
import { getMemberTypes } from "./memberTypes.service";

export const getMemberTypesByIds = async (db: DB, ids: (string | null | undefined)[]) => {
  const memberTypes = await getMemberTypes(db);
  return memberTypes.filter((memberType) => ids.includes(memberType.id));
};

export const getProfilesByUserIds = async (db: DB, ids: string[]) => {
  const profiles = await getProfiles(db);
  return profiles.filter((profile) => ids.includes(profile.userId));
};

export const getMemberTypeByIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  const objKey = {
    func: getMemberTypeByIdWithBatching.name,
    ...info.fieldNodes,
  };
  let dl = dataloaders.get(objKey);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getMemberTypesByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(objKey, dl);
  }
  return dl.load(args.id);
};

export const getMemberTypeByUserIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  const objKey = {
    func: getMemberTypeByUserIdWithBatching.name,
    ...info.fieldNodes,
  };
  let dl = dataloaders.get(objKey);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getProfilesByUserIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.userId === id)
      );
      return sortedInIdsOrder.map((prof: ProfileEntity) => prof?.memberTypeId);
    });
    dataloaders.set(objKey, dl);
  }
  return dl.load(args.id);
};
