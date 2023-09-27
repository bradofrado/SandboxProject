import type { Patient } from "model/src/patient";
import React, { useState } from "react";
import { displayElapsedTime, displayStorageSpace } from "model/src/utils";
import type { IconComponent} from "../../../core/icons";
import { CheckmarkIcon, DocumentTextIcon, FolderIcon, TridotIcon, UploadIcon } from "../../../core/icons";
import type { DropdownItem} from "../../../core/dropdown";
import { DropdownLineItem, ListBoxPopover } from "../../../core/dropdown";
import { Pill } from "../../../core/pill";

export interface DocumentsTabProps {
	patient: Patient
}
export const DocumentsTab: React.FunctionComponent<DocumentsTabProps> = ({patient}) => {
	const createDate = (milisecondsAgo: number): Date => {
		const date = new Date();
		date.setTime(date.getTime() - milisecondsAgo);

		return date;
	}
	const documents: Document[] = [
		{
			name: 'Abarca, Maria Release Form',
			logo: DocumentTextIcon,
			onSelect: () => { alert('You selected a file'); },
			lastUpdate: createDate(4000),
			storageSpace: 1000000
		},
		{
			name: 'Medical Records',
			logo: FolderIcon,
			onSelect: () => { alert('You selected a folder'); },
			lastUpdate: createDate(60000 * 10),
			storageSpace: 685760000
		},
		{
			name: 'Legal Docs',
			logo: FolderIcon,
			onSelect: () => { alert('You selected a folder'); },
			lastUpdate: createDate(3600000 * 3),
			storageSpace: 3400000000
		}
	]
	
	const onUpload = (files: FileList): void => {
		alert(`Uploaded ${files.length} files!`)
	}
	return (
		<div className="flex flex-col rounded-3xl shadow-md overflow-hidden">
			{documents.map(document => <DocumentLine document={document} key={document.name}/>)}
			<div className="px-5 py-10">
				<FileUploadArea onUpload={onUpload}/>
			</div>
			<div className="bg-primary py-3 px-4 flex items-center gap-2">
				<div className="rounded-full border border-gray-900 p-[.125rem]">
					<CheckmarkIcon className="w-3 h-3 fill-gray-900"/>
				</div>
				<span className="text-sm font-medium text-gray-900">Last Synced: 3m ago</span>
			</div>
		</div>
	)
}

interface DocumentLineProps {
	document: Document
}
const DocumentLine: React.FunctionComponent<DocumentLineProps> = ({document}) => {
	const Icon = document.logo;
	
	return (
		<button className="flex justify-between items-center border-b p-4 cursor-pointer hover:bg-gray-100" onDoubleClick={document.onSelect} type="button">
			<div className="flex gap-2">
				<Icon className="w-6 h-6"/>
				<div className="text-left">
					<div className="font-medium">{document.name}</div>
					<div className="text-sm">{displayElapsedTime(document.lastUpdate)}</div>
				</div>
			</div>
			<div className="flex gap-2">
				<Pill mode='secondary'>{displayStorageSpace(document.storageSpace)}</Pill>
				<TridotButtonOptions/>
			</div>
		</button>
	)
}

const TridotButtonOptions = ({}) => {
	const [isOpen, setIsOpen] = useState(false);
	const TridotButton = <button className="hover:bg-gray-200 rounded-full p-1" type="button">
		<TridotIcon className="w-5 h-5"/>
	</button>
	const items: DropdownItem<number>[] = [
		{
			id: 0,
			name: <DropdownLineItem onClick={() => { setIsOpen(false); }}>Delete</DropdownLineItem>
		},
		{
			id: 1,
			name: <DropdownLineItem onClick={() => { setIsOpen(false); }}>Export</DropdownLineItem>
		},
		{
			id: 2,
			name: <DropdownLineItem onClick={() => { setIsOpen(false); }}>Send To</DropdownLineItem>
		}
	]
	return (
		<ListBoxPopover isOpen={isOpen} items={items} setIsOpen={setIsOpen}>
			{TridotButton}
		</ListBoxPopover>
	)
}

interface FileUploadAreaProps {
	onUpload: (files: FileList) => void
}
const FileUploadArea: React.FunctionComponent<FileUploadAreaProps> = ({onUpload}) => {
	const [dragActive, setDragActive] = useState(false);
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		e.target.files && onUpload(e.target.files);
	}

	const handleDrag: React.DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

	const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		setDragActive(false);
		if (e.dataTransfer.files[0]) {
			onUpload(e.dataTransfer.files);
		}
	}

	return (	
		<div className="flex items-center justify-center w-full relative" onDragEnter={handleDrag}>
			<label className={`flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${dragActive ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`} htmlFor="dropzone-file">
				<div className="flex flex-col items-center justify-center pt-5 pb-6">
					<UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
					<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
				</div>
				<input className="hidden" id="dropzone-file" onChange={onChange} type="file"/>
			</label>
			{ dragActive ? <div className="absolute top-0 left-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}/> : null }
		</div> 
	)
}

interface Document {
	name: string,
	logo: IconComponent,
	lastUpdate: Date,
	storageSpace: number,
	onSelect: () => void
}