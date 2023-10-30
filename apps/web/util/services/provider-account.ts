import { ProviderAccount } from "model/src/patient";
import { api } from "../api"

export const useGetProviderAccount = () => {
	return api.setup.getProviderAccount.useQuery();
}

export const useUpdateProviderAccount = () => {
	const query = api.setup.updateProviderAccount.useMutation();
	const client = api.useContext();

	return {
		...query,
		mutate: (account: ProviderAccount) => {
			query.mutate(account, {
				async onSuccess() {
					await client.setup.getProviderAccount.invalidate();
				}
			})
		}
	}
}