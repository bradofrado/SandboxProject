import { useState } from "react";
import type { Login } from "model/src/auth";
import { Header } from "ui/src/components/core/header";
import { Hyperlink } from "ui/src/components/core/hyperlink";
import { LoginForm } from "ui/src/components/feature/auth/login-form";
import { useSignIn } from "../../services/auth";

export interface LoginViewProps {
  onSuccessfullLogin: () => void;
}
export const LoginView: React.FunctionComponent<LoginViewProps> = ({
  onSuccessfullLogin,
}) => {
  const [error, setError] = useState<string | null>(null);
  const signIn = useSignIn();
  const onSubmit = async (user: Login): Promise<void> => {
    const result = await signIn(user);

    if (result.ok) {
      onSuccessfullLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Header className="mt-10 text-center" level={2}>
          Sign in to your account
        </Header>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm
          error={error}
          onSubmit={(user) => void onSubmit(user)}
          setError={setError}
        />
        <p className="mt-10 text-center text-sm text-gray-500">
          Don&#39;t have an account?
          <Hyperlink href="/signup"> Sign up now</Hyperlink>
        </p>
      </div>
    </div>
  );
};
