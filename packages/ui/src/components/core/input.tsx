import React from 'react';
import {Label} from './label';
import { getClass } from 'model/src/utils';

interface InputProps {
	onChange?: (value: string) => void,
	value?: string | number | readonly string[] | undefined,
	className?: string,
	type?: "input" | "textarea" | "password" | "email",
	label?: string,
	placeholder?: string,
	required?: boolean
}
export const Input: React.FunctionComponent<InputProps> = ({onChange, value, className, label, type="input", placeholder, required}) => {
    const props = {
			className: `${className || ''} bg-gray-50 border shadow-sm rounded-md px-3 py-1.5 text-sm text-gray-900 focus:border-primary focus-visible:outline-none `,
			onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {onChange && onChange(e.target.value)},
			placeholder,
			required
    }
    const input = type === "textarea" ? <textarea {...props} value={value} /> : <input {...props} type={type} value={value} />
    if (label) {
        return <Label label={label}>{input}</Label>
    }
	return input;
}

export interface CheckboxInputProps {
	className?: string,
	value: boolean,
	onChange?: (value: boolean) => void,
	label?: string
}
export const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = ({value, onChange, label, className}) => {
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		onChange && onChange(e.target.checked);
	}
	
	const input = <input checked={value} onChange={onInputChange} type="checkbox" className={getClass(className, 'text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-light dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer')}/>
	if (label) {
		return <Label label={label}>{input}</Label>
	}

	return input;
}