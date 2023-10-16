import type { ProviderAccount, AccountType, IntegrationType} from "model/src/patient";
import { providerIntegrations, firmIntegrations } from "model/src/patient";
import { useState } from "react";
import { Button } from "ui/src/components/core/button";
import type { DropdownItem} from "ui/src/components/core/dropdown";
import { Dropdown } from "ui/src/components/core/dropdown";
import { Input } from "ui/src/components/core/input";
import { Label } from "ui/src/components/core/label";
import { integrationItems, integrationControls } from "./setup-integrations";

export interface SetupFormProps {
	onChange: (accountParams: Omit<ProviderAccount, 'id'>) => void
}
export const SetupForm: React.FunctionComponent<SetupFormProps> = ({onChange}) => {
	const [accountType, setAccountType] = useState<AccountType | undefined>();
	const [name, setName] = useState('');
	const [rest, setRest] = useState<Omit<ProviderAccount, 'id' | 'name' | 'accountType'>>();
	
	const onContinue = (): void => {
		if (rest && accountType && name) {
			onChange({...rest, accountType, name})
		}
	}

	const accountTypeItems: DropdownItem<AccountType>[] = [
		{
			id: 'provider',
			name: 'Medical Provider',
		},
		{
			id: 'firm',
			name: 'Attorney Firm'
		}
	]

	return (
		<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			<Label className="sm:col-span-full" label="Name">
				<Input className="w-full" onChange={setName} value={name}/>
			</Label>
			<Label className="sm:col-span-3" label="Account Type">
				<Dropdown className="w-full" initialValue={accountType} items={accountTypeItems} onChange={(item) => {setAccountType(item.id)}}>Select</Dropdown>
			</Label>
			{accountType ? <AccountTypeForm accountType={accountType} key={accountType} onChange={setRest}/> : null}
			{rest && accountType && name ? <Button onClick={onContinue}>Continue</Button> : null}
		</div>
	)
}

interface AccountTypeProps {
	accountType: AccountType,
	onChange: (params: Omit<ProviderAccount, 'id' | 'name' | 'accountType'> | undefined) => void
}
const AccountTypeForm: React.FunctionComponent<AccountTypeProps> = ({onChange, accountType}) => {
	const [integration, setIntegration] = useState<IntegrationType | undefined>();
	const filteredItems = integrationItems.filter(item => accountType === 'provider' ? (providerIntegrations as readonly IntegrationType[]).includes(item.id) : (firmIntegrations as readonly IntegrationType[]).includes(item.id));

	const IntegrationControl = integration ? integrationControls[integration] : undefined;

	const onIntegrationControlChange = (rest: Omit<ProviderAccount, "id" | "name" | "accountType" | "integration"> | undefined): void => {
		if (rest && integration) {
			onChange({...rest, integration})
		} else {
			onChange(undefined);
		}
	}
	return (<>
		<Label className="sm:col-span-3" label="Integration">
			<Dropdown className="w-full" initialValue={integration} items={filteredItems} onChange={(item) => {setIntegration(item.id)}}>Select</Dropdown>
		</Label>
		{integration && IntegrationControl ? <IntegrationControl key={integration} onChange={onIntegrationControlChange}/> : null}
		</>
	)
}