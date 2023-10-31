import React, { useRef, useState } from "react";
import type { Patient, PatientDocument } from "model/src/patient";
import { displayElapsedTime, displayStorageSpace } from "model/src/utils";
import type { DropdownItem } from "ui/src/components/core/dropdown";
import { DropdownLineItem, ListBoxPopover } from "ui/src/components/core/dropdown";
import {
  CheckmarkIcon,
  DocumentTextIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  UploadIcon,
} from "ui/src/components/core/icons";
import { Pill } from "ui/src/components/core/pill";
import { DocumentViewer } from "ui/src/components/feature/document-viewer/document-viewer";
import { Button } from "ui/src/components/core/button";
import { useClickOutside } from "ui/src/hooks/click-outside";
import type { UniqueIdentifier } from "ui/src/components/core/draggable";
import { Draggable, DraggableContext, Droppable } from "ui/src/components/core/draggable";
import {FileUploadArea} from 'ui/src/components/core/file-upload-area';
import { useGetPatientDocuments } from "../../../services/patient";
import {useUploadDocument} from '../../../services/document';

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
	const {upload} = useUploadDocument();
	const ref = useRef<HTMLDivElement>(null);
	
	useClickOutside(ref, () => {
		setSelectedFiles([]);
	})
	

  if (query.isLoading || query.isError) return <>Loading</>;

  const documents = query.data;

  const openDocument = (document: PatientDocument): void => {
		if (document.type !== 'folder') {
			setOpenedFile(document);
		}
	};

	const uploadFiles = (files: FileList): void => {
    upload(files).then(() => alert('Uploaded files!')).catch(() => alert('There was an error with the upload'));
  };

	const deleteDocuments = (documents: PatientDocument[]): void => {
		//TODO: Implement delete documents
		alert(`Deleting ${documents.map(d => d.name)}`)
	}

	const exportDocuments = (documents: PatientDocument[]): void => {
		//TODO: Implement export documents
		alert(`Exporting ${documents.map(d => d.name)}`)
	}

	const sendToDocument = (documents: PatientDocument[]): void => {
		//TODO: Implement send to documents
		alert(`Sending ${documents.map(d => d.name)}`)
	}

	const moveToFolder = (toMove: PatientDocument[], folder: PatientDocument): void => {
		alert(`Moving ${toMove.map(file => file.name)} into folder ${folder.name}`);
	}

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
			action: deleteDocuments,
			shouldShow: (files) => files.length > 0
		},
		{
			label: 'Export',
			action: exportDocuments,
			shouldShow: (files) => files.length > 0
		},
		{
			label: 'Send To',
			action: sendToDocument,
			shouldShow: (files) => files.length > 0
		}
	]

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

	const onDragEnd = (activeId: UniqueIdentifier, overId: UniqueIdentifier | undefined): void => {
		if (overId && activeId !== overId) {
			// If we have selected some files, then the dragged files are those that are selected. Otherwise just get the active id (single file being dragged)
			const ids = typeof activeId === 'string' && activeId.includes('selected') ? selectedFiles.map(file => file.name) : [activeId];
			const toMove: PatientDocument[] = documents.filter(document => ids.includes(document.name));
			const folder: PatientDocument | undefined = documents.find(document => document.name === overId && document.type === 'folder');

			// Make sure we have stuff to move and we are not moving anything into itself
			if (toMove.length > 0 && folder && !toMove.includes(folder)) {
				moveToFolder(toMove, folder);
			}
		}
	}
  return (
		<div ref={ref}>
			{patient.status === 'Document Requested' ? <span className="text-red-500 p-2">Upload Documents</span> : null}
			<div className="flex flex-col rounded-md shadow-md overflow-hidden">
				<DraggableContext onDragEnd={onDragEnd}>
					{documents.map((document) => (
						<DocumentLine
							document={document}
							key={document.name}
							onDelete={() => {deleteDocuments([document])}}
							onExport={() => {exportDocuments([document])}}
							onOpen={() => {
								openDocument(document);
							}}
							onSelect={(ctlKey) => {
								selectFile(document, ctlKey);
							}}
							onSendTo={() => {sendToDocument([document])}}
							selectedId={selectedFiles.includes(document) ? `selected-${selectedFiles.length}` : undefined}
						/>
					))}
				</DraggableContext>
				<div className="px-5 py-10">
					<FileUploadArea onUpload={uploadFiles} />
				</div>
				<div className="bg-primary py-3 px-4 flex items-center gap-2">
					<div className="rounded-full border border-white p-[.125rem]">
						<CheckmarkIcon className="w-3 h-3 fill-white" />
					</div>
					<span className="text-sm font-medium text-white">
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
	onDelete: () => void;
	onExport: () => void;
	onSendTo: () => void;
	onSelect: (ctlKey: boolean) => void;
	selectedId: string | undefined;
}
const DocumentLine: React.FunctionComponent<DocumentLineProps> = ({
  document,
  onOpen,
	onDelete,
	onExport,
	onSendTo,
	onSelect,
	selectedId,
}) => {
  const Icon = document.type !== "folder" ? DocumentTextIcon : FolderIcon; 

	const getChildren = (isDropping: boolean): JSX.Element => (
		//The selected id is so that selecting multiple files will drag all of them at the same time
		<Draggable id={selectedId ?? document.name}>
			<button
				className={`flex justify-between items-center border-b p-4 cursor-pointer outline-none w-full ${isDropping ? 'bg-gray-50' : ''} ${selectedId ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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
					<TridotButtonOptions onDelete={onDelete} onExport={onExport} onSendTo={onSendTo}/>
				</div>
			</button>
		</Draggable>
	)

	if (document.type === 'folder') {
		return <Droppable id={`${document.name}`}>
			{getChildren}
		</Droppable>
	}

	return getChildren(false);
};

interface TridotButtonOptionsProps {
	onDelete: () => void,
	onExport: () => void,
	onSendTo: () => void,
}
const TridotButtonOptions: React.FunctionComponent<TridotButtonOptionsProps> = ({onDelete, onExport, onSendTo}) => {
  const [isOpen, setIsOpen] = useState(false);
  const TridotButton = (
    <button className="hover:bg-gray-200 rounded-full p-1" type="button">
      <EllipsisHorizontalIcon className="w-5 h-5" />
    </button>
  );
  const items: DropdownItem<number>[] = [
    {
      id: 0,
      name: (
        <DropdownLineItem
          onClick={() => {
            setIsOpen(false);
						onDelete();
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
						onExport();
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
						onSendTo();
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
