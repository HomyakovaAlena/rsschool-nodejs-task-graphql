import { validate as uuidValidate } from "uuid";

import { correctMemberTypes } from "./member-types.validation";
import { correctPostsTypes } from "./posts.validation";
import { correctProfilesTypes } from "./profiles.validation";
import { correctUsersTypes } from "./users.validation";

const correctTypesConfig = {
  memberTypes: correctMemberTypes,
  posts: correctPostsTypes,
  profiles: correctProfilesTypes,
  users: correctUsersTypes,
};

type UnknownObject = {
  [key: string]: any;
};

type UnknownTypedObject = {
  type: string;
};

export const isFieldDefined = (param: unknown) => !!param;

export const areAllFieldsDefined = (fieldsArray: unknown[]) =>
  !!fieldsArray.every((field) => isFieldDefined(field));

export const areAllTypesCorrect = (fieldsObject: Object, route: string) => {
  const properObjectTypes =
    correctTypesConfig[route as unknown as keyof typeof correctTypesConfig];

  return Object.keys(fieldsObject).every((key) => {
    const properFieldType = properObjectTypes[
      key as keyof typeof properObjectTypes
    ] as UnknownTypedObject;

    return (
      typeof fieldsObject[key as unknown as keyof typeof fieldsObject] ===
      properFieldType.type
    );
  });
};

export const isEmptyBody = (fieldsObject: UnknownObject) =>
  Object.keys(fieldsObject).length === 0;

export const isValidUuid = (str: string) => uuidValidate(str);
