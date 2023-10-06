import type { NextPage } from "next";
import { useRouter } from "next/router";
import { LoginView } from "../util/components/auth/login-view";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const onSuccess = (): void => {
    void router.push("/");
  };
  return <LoginView onSuccessfullLogin={onSuccess} />;
};

export default LoginPage;
