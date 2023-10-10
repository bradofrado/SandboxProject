import type { NextPage } from "next";
import type { DropdownItem } from "ui/src/components/core/dropdown";
import { Dropdown } from "ui/src/components/core/dropdown";
import { Header } from "ui/src/components/core/header";
import { Button } from "ui/src/components/core/button";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../util/api";

const SetupPage: NextPage = () => {
	const query = api.setup.getProviderAccount.useQuery();
	const {mutate, ...createAccountUtils} = api.setup.createProviderAccount.useMutation();
	const [integration, setIntegration] = useState('');
	const router = useRouter();

	if (query.isLoading || query.isError || createAccountUtils.isLoading || createAccountUtils.isError) {
		return <>loading</>;
	}

	const onContinue = (): void => {
		mutate({integration}, {
			onSuccess: () => {
				void router.push('/');
		}})
	}

	const currIntegration = query.data?.integration;

	const integrationItems: DropdownItem<string>[] = [
		{
			id: 'Kareo',
			name: 'Kareo'
		}
	]
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-5">
        <Header level={1}>Choose your Integration</Header>
				<Dropdown initialValue={integration || currIntegration} items={integrationItems} onChange={(item) => {setIntegration(item.id)}}>Select</Dropdown>
				{integration ? <Button onClick={onContinue}>Continue</Button> : null}
    </div>
	)
}

export default SetupPage;