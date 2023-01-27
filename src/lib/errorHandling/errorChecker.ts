export const isErrorNoRequiredEntity = (err: unknown) =>
  err instanceof Error && err.name === "No required entity";

export const isErrorForbiddenOperation = (err: unknown) =>
  err instanceof Error && err.name.startsWith("forbidden operation");

export const throwError = (err: unknown) => {
  if (err instanceof Error) {
    throw new Error(err.message);
  }
};
