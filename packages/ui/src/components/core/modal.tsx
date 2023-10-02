import type { ReplaceWithName } from "model/src/core/utils";
import { createContext, useCallback, useContext, useEffect, useState } from "react"

interface ModalContextType {
	addModal: (newModal: React.ReactNode) => void,
	removeModal: (toRemoveId: number) => void,
	nextId: number
}
const ModalContext = createContext<ModalContextType>({addModal: () => undefined, removeModal: () => undefined, nextId: -1});
export const ModalProvider: React.FunctionComponent<React.PropsWithChildren> = ({children}) => {
	const [modals, setModals] = useState<React.ReactNode[]>([]);

	const addModal = useCallback((newModal: React.ReactNode): void => {
		const copy = modals.slice();
		copy.push(newModal);
		setModals(copy);
	}, [modals]);

	const removeModal = useCallback((toRemove: number): void => {
		const copy = modals.slice();
		const index = toRemove;
		//if (index < 0) throw new Error('Cannot remove modal');

		if (index >= 0)
			copy.splice(index);
		setModals(copy);
	}, [modals]);

	return (
		<ModalContext.Provider value={{addModal, removeModal, nextId: modals.length}}>
			{children}
			{modals.length > 0 ? <div className="fixed top-0 left-0 w-full z-50 bg-gray-500/90 min-h-screen">
				{modals}
			</div> : null}
		</ModalContext.Provider>
	)
}

export const ModalPortal: React.FunctionComponent<{children: React.ReactNode, show: boolean}> = ({children, show}) => {
	const {addModal, removeModal} = useModal();

	useEffect(() => {
		if (show) {
			addModal(children);
		} else {
			removeModal();
		}
	}, [show]);

	return <></>
}

export const useModal = (): ReplaceWithName<ModalContextType, 'nextId' | 'removeModal', {removeModal: () => void}> => {
	const modal = useContext(ModalContext);
	const [id] = useState(modal.nextId);
	const removeModal = (): void => {
		modal.removeModal(id);
	}

	return {addModal: modal.addModal, removeModal};
}