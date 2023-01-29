import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { Args, Context, Info } from "../graphql/resolvers";
import { getMemberTypes } from "./memberTypes.service";

export const getMemberTypesByIds = async (db: DB, ids: string[]) => {
  const memberTypes = await getMemberTypes(db);
  return memberTypes.filter((memberType) => ids.includes(memberType.id));
};

export const getMemberTypeByIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  let dl = dataloaders.get(info.fieldNodes);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getMemberTypesByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(info.fieldNodes, dl);
  }
  return dl.load(args.id);
};
