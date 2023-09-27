import { useState } from "react";
import { Signup } from "model/src/auth";

import { useSignup } from "../../../services/auth";
import { Header } from "../../core/header";
import { Hyperlink } from "../../core/hyperlink";
import { SignupForm } from "../../feature/auth/signup-form";

export const SignupView: React.FunctionComponent = () => {
  const { mutate: signUp, ...signUpUtils } = useSignup();
  const [error, setError] = useState<string | null>(null);

  if (signUpUtils.isError) {
    setError(
      "There was an error with your signup. Please check your inputs and try again.",
    );
  }

  const onSubmit = (user: Signup): void => {
    signUp(user);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Header className="mt-10 text-center" level={2}>
          Sign up for an account
        </Header>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignupForm error={error} onSubmit={onSubmit} />
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <Hyperlink href="/login"> Login now</Hyperlink>
        </p>
      </div>
    </div>
  );
};
