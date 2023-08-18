import { useEffect, useState } from "react";
import Input from "../base/input";
import Button from "../base/button";

export type EditableTextProps = {
    text: string,
    editEmitter: Emitter<() => void>,
    onChange: (value: string) => void
}
export const EditableText = ({text, editEmitter, onChange}: EditableTextProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const [dirtyText, setDirtyText] = useState(text);
    useEffect(() => {
        editEmitter.subscribe(() => setIsEdit(true))
    }, [])

    const onCancel = () => {
        setDirtyText(text);
        setIsEdit(false);
    }

    const onSave = () => {
        onChange(dirtyText);
        setIsEdit(false);
    }
    
    return <>
        {isEdit ? <>
            <Input className="w-full" type="textarea" value={dirtyText} onChange={setDirtyText}/> 
            <div className="flex justify-end mt-2">
                <Button mode='secondary' onClick={onCancel}>Cancel</Button>
                <Button className="ml-2" mode='primary' onClick={onSave}>Save</Button>
            </div>
        </>: 
        <p>{text}</p>}
    </>
}

export class Emitter<T extends (...args: any) => any> {
    private subscriptions: T[] = [];
    public subscribe(func: T) {
        this.subscriptions.push(func);
    }

    public emit() {
        for (const func of this.subscriptions) {
            func();
        }  
    }
}