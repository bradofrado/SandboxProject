import React from 'react';
import {Label} from './label';

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