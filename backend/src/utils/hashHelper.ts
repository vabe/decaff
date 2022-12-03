import { genSalt, hash } from "bcrypt";

export const hashValue = async (data: string): Promise<string> => {
  const salt = await genSalt(10);

  return hash(data, salt);
};
