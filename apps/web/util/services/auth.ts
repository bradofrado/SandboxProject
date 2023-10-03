import type { Login, Signup } from "model/src/auth";

export interface SignInResult {
  ok: boolean;
}
export type SignInDispatch = (_: Login) => Promise<SignInResult>;
export const useSignIn = (): SignInDispatch => {
  const signIn: SignInDispatch = () =>
    Promise.resolve<SignInResult>({ ok: true });

  return signIn;
};

export const useSignup = () => {
  return {
    mutate: (user: Signup) => undefined,
    isError: false,
  };
};
