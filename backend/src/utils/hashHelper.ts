import { Logger } from "@nestjs/common";
import { genSalt, hash } from "bcrypt";
import { isEmpty, isUndefined } from "lodash";

export const hashValue = async (data: string): Promise<string> => {
  const saltRounds = process.env.HASH_SALT_ROUNDS;
  if (isUndefined(saltRounds) || isEmpty(saltRounds)) {
    Logger.warn(
      "Hash salt rounds not defined, using default value for now. Please provide a value for HASH_SALT_ROUNDS environment variable.",
    );
  }
  const salt = await genSalt(+saltRounds ?? 10);

  return hash(data, salt);
};
