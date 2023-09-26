import {Fragment, useRef, useState} from 'react';
import type { AllOrNothing } from 'model/src/core/utils';
import {Popover as ReactPopover} from './date-picker'

type PopoverProps = React.PropsWithChildren<{
    button: React.ReactNode,
		className?: string,
} & AllOrNothing<{isOpen: boolean, setIsOpen: (value: boolean) => void}>>
export const Popover: React.FunctionComponent<PopoverProps> = ({children, button, isOpen, setIsOpen, className='p-2'}) => {
	const [isOpenState, setIsOpenState] = useState<boolean | undefined>(isOpen === undefined ? false : undefined);
	const isOpenActual: boolean = isOpen !== undefined ? isOpen : Boolean(isOpenState);
	const setIsOpenActual = isOpen !== undefined ? setIsOpen : setIsOpenState as (value: boolean) => void;
	const ref = useRef<HTMLButtonElement>(null);
	const state = {
		isOpen: isOpenActual, 
		setOpen: setIsOpenActual, 
		open: () => {setIsOpenActual(true)},
		close: () => {setIsOpenActual(false)},
		toggle: () => {setIsOpenActual(!isOpenActual)}
	}
	return (
		<>
			<button onClick={() => {setIsOpenActual(!isOpenActual)}} ref={ref} type="button">
				{button}
			</button>
			{isOpenActual ? <ReactPopover className={className} state={state} triggerRef={ref}>
				{children}
			</ReactPopover> : null}
		</>
	);
}