import { useEffect } from "react";
import { useModal } from "../components/core/modal";

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void): void => {
	const {container} = useModal();
	useEffect(() => {
		container.addEventListener('mousedown', (event) => {
			if (!ref.current?.contains(event.target as Node)) {
				callback();
			}
		})
	}, [])
}