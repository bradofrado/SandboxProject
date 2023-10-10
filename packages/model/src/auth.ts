import { z } from "zod";
import { User } from "./user";
import { ProviderAccount } from "./patient";

export type AuthContext = {
	userId: string;
	user: User
} | null;

export interface Session {
  auth: AuthContext,
	account: ProviderAccount | undefined
}

export interface Login {
  email: Email;
  password: string;
}

export const SignupSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
});
export type Signup = z.infer<typeof SignupSchema>;

export type Email = `${string}@${string}`;
export const EmailSchema = z.custom<Email>((val) => {
  if (!(typeof val === "string")) return false;

  const indexOfAt = val.indexOf("@");

  //The @ symbol is not at the start or the end
  return indexOfAt > 0 && indexOfAt < val.length - 1;
});

const roles = ["user", "admin"] as const;
export type UserRole = (typeof roles)[number];
export const UserRoleSchema = z.custom<UserRole>(
  (data) =>
    typeof data === "string" && (roles as ReadonlyArray<string>).includes(data),
);
