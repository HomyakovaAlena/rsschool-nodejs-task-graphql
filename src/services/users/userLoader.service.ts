import DataLoader = require("dataloader");
import DB from "../../utils/DB/DB";
import { Args, Context, Info } from "../graphql/resolvers";
import { getUsers } from "./users.service";

export const getUsersByIds = async (db: DB, ids: string[]) => {
  const users = await getUsers(db);
  return users.filter((user) => ids.includes(user.id));
};

export const getUserByIdWithBatching = async (
  args: Args,
  context: Context,
  info: Info
) => {
  const { dataloaders } = context;
  const objKey = {
    func: getUserByIdWithBatching.name,
    ...info.fieldNodes,
  };
  let dl = dataloaders.get(objKey);
  if (!dl) {
    dl = new DataLoader(async (ids: any) => {
      const rows = await getUsersByIds(context.db, ids);
      const sortedInIdsOrder = ids.map((id: string) =>
        rows.find((x) => x.id === id)
      );
      return sortedInIdsOrder;
    });
    dataloaders.set(objKey, dl);
  }
  return dl.load(args.id);
};
