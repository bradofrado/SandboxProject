import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "ui/src/components/core/header";
import { Hyperlink } from "ui/src/components/core/hyperlink"
import { LoginForm } from "ui/src/components/feature/auth/login-form"
import { type Login } from "model/src/auth"

const signIn = async () => {
	return {ok: true};
}

const LoginPage: NextPage = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const onSubmit = async (user: Login) => {
			const result = await signIn("credentials", {
					...user,
					redirect: false
			});

			if (result?.ok) {
					void router.push('/')
			} else {
					setError('Invalid email or password');
			}
	}

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Header className="mt-10 text-center" level={2}>Sign in to your account</Header>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <LoginForm error={error} onSubmit={(user) => void onSubmit(user)} setError={setError}/>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Don&#39;t have an account?
                <Hyperlink href="/signup"> Sign up now</Hyperlink>
                </p>
            </div>
        </div>
		);
}

export default LoginPage;