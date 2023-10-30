import type { ProviderAccount, IntegrationType } from "model/src/patient";
import { arrayOfAll } from "model/src/utils";
import { useState } from "react";
import type { DropdownItem } from "ui/src/components/core/dropdown";
import { Input } from "ui/src/components/core/input";
import { Label } from "ui/src/components/core/label";

type IntegrationControl = React.FunctionComponent<{onChange: (params: Omit<ProviderAccount, 'id' | 'name' | 'accountType' | 'integration'> | undefined) => void}>
type IntegrationDropdownItem = ({
	[P in IntegrationType]: {id: P, name: string}
}[IntegrationType])

export const KareoIntegration: IntegrationControl = ({onChange}) => {
	const [apiKey, setApiKey] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const onBlur = (): void => {
		if (apiKey && username && password) {
			onChange({});
		} else {
			onChange(undefined);
		}
	}

	return (<>
		<Label className="sm:col-span-full" label="Api Key">
			<Input className="w-full" onBlur={onBlur} onChange={setApiKey} value={apiKey}/>
		</Label>
		<Label className="sm:col-span-3" label="Kareo Username">
			<Input className="w-full" onBlur={onBlur} onChange={setUsername} value={username}/>
		</Label>
		<Label className="sm:col-span-3" label="Kareo Password">
			<Input className="w-full" onBlur={onBlur} onChange={setPassword} type="password" value={password}/>
		</Label>
	</>)
}

export const SmartAdvocateIntegration: IntegrationControl = ({onChange}) => {
	const [apiKey, setApiKey] = useState('');

	return (
		<Label className="sm:col-span-full" label="Api Key">
			<Input className="w-full" onBlur={() => {onChange({})}} onChange={setApiKey} value={apiKey}/>
		</Label>
	)
}

export const integrationControls: Record<IntegrationType, IntegrationControl> = {
	'smartAdvocate': SmartAdvocateIntegration,
	'kareo': KareoIntegration
}

export const integrationItems: DropdownItem<IntegrationType>[] = arrayOfAll<IntegrationDropdownItem>()([
	{
		id: 'kareo',
		name: 'Kareo'
	},
	{
		id: 'smartAdvocate',
		name: 'Smart Advocate'
	},
]);
