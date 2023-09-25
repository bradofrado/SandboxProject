import { type Session } from "model/src/auth";

export const getServerAuthSession = (ctx: any): Session | undefined => {
  //return undefined;
  return {
    user: {
      role: "user",
    },
  };
};
