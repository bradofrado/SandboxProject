import type { ReplaceWithName } from "model/src/core/utils";
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { usePrevious } from "../../hooks/previous";

interface ModalContextType {
	addModal: (newModal: React.ReactNode) => void,
	removeModal: (toRemoveId: number) => void,
	nextId: number,
	container: HTMLElement
}
const ModalContext = createContext<ModalContextType>({addModal: () => undefined, removeModal: () => undefined, nextId: -1, container: null});
export const ModalProvider: React.FunctionComponent<{container: HTMLElement} & React.PropsWithChildren> = ({children, container}) => {
	const [modals, setModals] = useState<React.ReactNode[]>([]);

	const addModal = useCallback((newModal: React.ReactNode): void => {
		const copy = modals.slice();
		copy.push(newModal);
		setModals(copy);
		container.style.overflow = 'hidden';
	}, [modals]);

	const removeModal = useCallback((toRemove: number): void => {
		const copy = modals.slice();
		const index = toRemove;
		if (index < 0) throw new Error('Cannot remove modal');

		copy.splice(index);

		if (copy.length === 0) {
			container.style.overflow = 'auto';
		}
			
		setModals(copy);
	}, [modals]);

	return (
		<ModalContext.Provider value={{addModal, removeModal, nextId: modals.length, container}}>
			{children}
			{modals.length > 0 ? <div className="fixed top-0 left-0 w-full z-50 bg-gray-500/90 h-screen overflow-auto">
				{modals}
			</div> : null}
		</ModalContext.Provider>
	)
}

export const ModalPortal: React.FunctionComponent<{children: React.ReactNode, show: boolean}> = ({children, show}) => {
	const {addModal, removeModal} = useModal();
	const prevShow = usePrevious(show);
	
	useEffect(() => {
		if (prevShow !== show) {
			if (show) {
				addModal(children);
			} else {
				removeModal();
			}
		}
	}, [show, prevShow]);

	return <></>
}

export const useModal = (): ReplaceWithName<ModalContextType, 'nextId' | 'removeModal', {removeModal: () => void}> => {
	const {nextId, removeModal, ...rest} = useContext(ModalContext);
	const [id] = useState(nextId);
	const remove = (): void => {
		removeModal(id);
	}

	return {...rest, removeModal: remove};
}