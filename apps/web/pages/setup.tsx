import type { NextPage } from "next";
import { Header } from "ui/src/components/core/header";
import React from "react";
import { useRouter } from "next/router";
import type { ProviderAccount } from "model/src/patient";
import { api } from "../util/api";
import { SetupForm } from "../util/components/setup/setup-form";

const SetupPage: NextPage = () => {
	const {mutate, ...createAccountUtils} = api.setup.createProviderAccount.useMutation();
	const router = useRouter();

	if (createAccountUtils.isLoading) {
		return <>loading</>;
	}

	if (createAccountUtils.isError) {
		return <>{createAccountUtils.error.message}</>
	}

	const onContinue = (account: Omit<ProviderAccount, 'id'>): void => {
		mutate(account, {
			onSuccess: () => {
				void router.push('/');
		}})
	}
	
	return (
		<div className="flex flex-col sm:w-[50%] sm:p-0 px-5 mx-auto gap-5 my-10">
        <Header className="text-center" level={1}>Setup Your Account</Header>
				<SetupForm onChange={onContinue}/>
    </div>
	)
}



export default SetupPage;