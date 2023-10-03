import React, { useEffect, useRef, useState } from "react";
import type { Patient, PatientDocument } from "model/src/patient";
import { displayElapsedTime, displayStorageSpace } from "model/src/utils";
import { useGetPatientDocuments } from "../../../../services/patient";
import type { DropdownItem } from "../../../core/dropdown";
import { DropdownLineItem, ListBoxPopover } from "../../../core/dropdown";
import {
  CheckmarkIcon,
  DocumentTextIcon,
  FolderIcon,
  TridotIcon,
  UploadIcon,
} from "../../../core/icons";
import { Pill } from "../../../core/pill";
import { DocumentViewer } from "../../../feature/document-viewer/document-viewer";
import { Button } from "../../../core/button";
import { useClickOutside } from "../../../../hooks/click-outside";

interface FileButton {
	label: string,
	action: (files: PatientDocument[]) => void,
	shouldShow: (files: PatientDocument[]) => boolean
}
export interface DocumentsTabProps {
  patient: Patient;
}
export const DocumentsTab: React.FunctionComponent<DocumentsTabProps> = ({
  patient,
}) => {
  const query = useGetPatientDocuments(patient.id);
	const [openedFile, setOpenedFile] = useState<PatientDocument | undefined>();
	const [selectedFiles, setSelectedFiles] = useState<PatientDocument[]>([]);
	const ref = useRef<HTMLDivElement>(null);
	
	useClickOutside(ref, () => {
		setSelectedFiles([]);
	})
	

  if (query.isLoading || query.isError) return <>Loading</>;

	

  const documents = query.data;

	const fileButtons: FileButton[] = [
		{
			label: 'Open',
			action: (files) => {
				openDocument(files[0]);
			},
			shouldShow: (files) => files.length === 1
		},
		{
			label: 'Delete',
			action: () => {},
			shouldShow: (files) => files.length > 0
		},
		{
			label: 'Export',
			action: () => {},
			shouldShow: (files) => files.length > 0
		},
		{
			label: 'Send To',
			action: () => {},
			shouldShow: (files) => files.length > 0
		}
	]

  const onUpload = (files: FileList): void => {
    alert(`Uploaded ${files.length} files!`);
  };

  const openDocument = (document: PatientDocument): void => {
		if (document.type !== 'folder') {
			setOpenedFile(document);
		}
	};

	const selectFile = (document: PatientDocument, selectAll: boolean): void => {
		let copy = selectedFiles.slice();
		const index = copy.indexOf(document);
		if (index < 0) {
			if (selectAll) {
				copy.push(document);
			} else {
				copy = [document];
			}
		} else if (selectAll) {
			copy.splice(index, 1);
		} else {
			copy = copy.length > 1 ? [document] : [];
		}
		setSelectedFiles(copy);
	}
  return (
		<div ref={ref}>
			<div className="flex mb-2 gap-2">
				{fileButtons.map(button => button.shouldShow(selectedFiles) ? <Button key={button.label} onClick={() => {button.action(selectedFiles)}} mode="secondary">{button.label}</Button> : null)}
			</div>
			<div className="flex flex-col rounded-3xl shadow-md overflow-hidden">
				{documents.map((document) => (
					<DocumentLine
						document={document}
						key={document.name}
						onOpen={() => {
							openDocument(document);
						}}
						onSelect={(ctlKey) => {
							selectFile(document, ctlKey);
						}}
						selected={selectedFiles.includes(document)}
					/>
				))}
				<div className="px-5 py-10">
					<FileUploadArea onUpload={onUpload} />
				</div>
				<div className="bg-primary py-3 px-4 flex items-center gap-2">
					<div className="rounded-full border border-gray-900 p-[.125rem]">
						<CheckmarkIcon className="w-3 h-3 fill-gray-900" />
					</div>
					<span className="text-sm font-medium text-gray-900">
						Last Synced: 3m ago
					</span>
				</div>
				<DocumentViewer onClose={() => {setOpenedFile(undefined)}} show={Boolean(openedFile)} src={openedFile?.path} type={openedFile?.type as Exclude<PatientDocument['type'], 'folder'>}/>
			</div>
		</div>
  );
};

interface DocumentLineProps {
  document: PatientDocument;
  onOpen: () => void;
	onSelect: (ctlKey: boolean) => void;
	selected: boolean;
}
const DocumentLine: React.FunctionComponent<DocumentLineProps> = ({
  document,
  onOpen,
	onSelect,
	selected,
}) => {
  const Icon = document.type !== "folder" ? DocumentTextIcon : FolderIcon;

  return (
    <button
      className={`flex justify-between items-center border-b p-4 cursor-pointer outline-none ${selected ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      onClick={(e) => {onSelect(e.ctrlKey)}}
			onDoubleClick={onOpen}
      type="button"
    >
      <div className="flex gap-2">
        <Icon className="w-6 h-6" />
        <div className="text-left">
          <div className="font-medium text-sm">{document.name}</div>
          <div className="text-sm">
            {displayElapsedTime(document.lastUpdate)}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Pill mode="secondary">{displayStorageSpace(document.size)}</Pill>
        <TridotButtonOptions />
      </div>
    </button>
  );
};

const TridotButtonOptions = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const TridotButton = (
    <button className="hover:bg-gray-200 rounded-full p-1" type="button">
      <TridotIcon className="w-5 h-5" />
    </button>
  );
  const items: DropdownItem<number>[] = [
    {
      id: 0,
      name: (
        <DropdownLineItem
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Delete
        </DropdownLineItem>
      ),
    },
    {
      id: 1,
      name: (
        <DropdownLineItem
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Export
        </DropdownLineItem>
      ),
    },
    {
      id: 2,
      name: (
        <DropdownLineItem
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Send To
        </DropdownLineItem>
      ),
    },
  ];
  return (
    <ListBoxPopover isOpen={isOpen} items={items} setIsOpen={setIsOpen}>
      {TridotButton}
    </ListBoxPopover>
  );
};

interface FileUploadAreaProps {
  onUpload: (files: FileList) => void;
}
const FileUploadArea: React.FunctionComponent<FileUploadAreaProps> = ({
  onUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.target.files && e.target.files.length > 0 && onUpload(e.target.files);
  };

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
    if (e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full relative"
      onDragEnter={handleDrag}
    >
      <label
        className={`flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
          dragActive
            ? "bg-gray-100 dark:bg-gray-600"
            : "bg-gray-50 dark:bg-gray-700"
        } hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
        htmlFor="dropzone-file"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
        </div>
        <input
          className="hidden"
          id="dropzone-file"
          onChange={onChange}
          type="file"
        />
      </label>
      {dragActive ? (
        <div
          className="absolute top-0 left-0 w-full h-full"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      ) : null}
    </div>
  );
};
