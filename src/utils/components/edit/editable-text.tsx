import { useEffect, useState } from "react";
import Input from "../base/input";
import Button from "../base/button";
import { type Subscriber } from "~/utils/hooks/useSubscriber";


export type EditableTextProps = {
    text: string,
    subscriber: Subscriber<() => void>,
    onChange: (value: string) => void
}
export const EditableText = ({text, subscriber, onChange}: EditableTextProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const [dirtyText, setDirtyText] = useState(text);
    useEffect(() => {
        subscriber(() => setIsEdit(true))
    }, [subscriber, setIsEdit])

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