import { UpdateQueryType } from "../..";

export const generateUpdateQuery = <T>(
  where: Partial<T>,
  update: Partial<T>
): UpdateQueryType<T> => {
  return { where, update };
};
