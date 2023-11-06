import type { NextPage } from "next";
import { FormTwoColumn } from 'ui/src/components/core/form-two-column'
import { Input } from "ui/src/components/core/input";
import { useChangeProperty } from "ui/src/hooks/change-property";
import { useState } from "react";
import type { ProviderAccount } from "model/src/patient";
import { Layout } from "../util/components/layout";
import { AccountTypeForm } from "../util/components/setup/setup-form";
import { useGetProviderAccount, useUpdateProviderAccount } from "../util/services/provider-account";
import { Button } from "ui/src/components/core/button";
import { useClerk } from "@clerk/nextjs";

const SettingsPage: NextPage = () => {
	const query = useGetProviderAccount();
	const {mutate, ...updateUtils} = useUpdateProviderAccount();
	const {signOut} = useClerk();

	if (query.isLoading || query.isError || query.data === null || updateUtils.isLoading || updateUtils.isError) {
		return <>Loading</>;
	}

	const onSave = (account: ProviderAccount): void => {
		mutate(account);
	}

	return (
		<Layout>
			<Button className="px-4 pt-8" mode="none" onClick={() => signOut()}>Sign Out</Button>
			<SettingsForm initialAccount={query.data} key={JSON.stringify(query.data)} onSave={onSave} />
		</Layout>
	)
}

interface SettingsFormProps {
	onSave: (account: ProviderAccount) => void,
	initialAccount: ProviderAccount
}
const SettingsForm: React.FunctionComponent<SettingsFormProps> = ({onSave: onSaveProps, initialAccount}) => {
	const [account, setAccount] = useState<ProviderAccount>(initialAccount);
	const [isDirty, setIsDirty] = useState(false);
	const changeAccount = useChangeProperty<ProviderAccount>((item) => {
		setIsDirty(true);
		setAccount(item);
	});

	const onSave = (): void => {
		onSaveProps(account);
		setIsDirty(false);
	}

	const onCancel = (): void => {
		setIsDirty(false);
		setAccount(initialAccount);
	}

	const items = [
		{
			title: 'Profile',
			description: 'This information will be displayed publicly so be careful what you share.',
			content: <>
				<div className="sm:col-span-4">
					<Input label="Name" onChange={(value) => changeAccount(account, 'name', value)} placeholder="Chiro Provider" value={account.name}/>
				</div>

				{/* <div className="col-span-full">
					<Label label="Photo">
						<div className="flex items-center gap-2">
							<ProfileImage className="h-12 w-12 text-gray-300" image={undefined} />
							<Button className="h-fit" mode='secondary'>Change</Button>
						</div>
					</Label>
				</div> */}
			</>
		},
		{
			title: 'Integration',
			description: 'Configure the api keys for your integration',
			content: <AccountTypeForm accountType={account.accountType} integration={account.integration} onChange={(params) => {params && setAccount({...account, ...params})}}/>
		}
	]
	return (
		<div className="px-4 sm:px-6 py-16 lg:px-8">
			<FormTwoColumn items={items} onCancel={onCancel} onSubmit={onSave} showButtons={isDirty}/>
		</div>
	)
}

export default SettingsPage;