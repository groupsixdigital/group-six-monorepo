import { v4 as uuid } from "uuid";
/** Simply uses UUID to return a v4 string. */
export const useUniqueID = () => {
  return uuid() as string;
};
