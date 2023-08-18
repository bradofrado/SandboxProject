import React from 'react';
import Label from './label';
type InputProps = {
	onChange?: (value: string) => void,
    value?: string | number | readonly string[] | undefined,
    className?: string,
    type?: "input" | "textarea",
    label?: string
}
const Input = ({onChange, value, className, label, type="input"}: InputProps) => {
    const props = {
        className: `${className || ''} bg-gray-50 border shadow-sm rounded-md px-3 py-1.5 text-sm text-gray-900 focus:border-primary focus-visible:outline-none `,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange && onChange(e.target.value)
    }
    const input = type == "input" ? <input {...props} value={value}/> : <textarea {...props} value={value}></textarea>
    if (label) {
        return <Label label={label}>{input}</Label>
    }
	return input;
}

export default Input;