import { api } from "../api";

export const useUploadDocument = () => {
	return {
		upload: async (patientId: string, fileList: FileList) => {
			const files: File[] = [...new Array<number>(fileList.length)].map((_, i) => fileList[i]);
			const formData = new FormData();
			formData.append('patientId', patientId);
			for (const file of files) {
				formData.append(file.name, file);
			}
			const result = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!result.ok) {
				const {message}: {message: string} = await result.json() as {message: string};
				throw new Error(message)
			}

			//return result;
		}
	}
}	

export const useDownloadDocument = () => {
	return {
		download: downloadFile
	}
}

export const useDeleteDocument = () => {
	const query = api.documents.deleteDocument.useMutation();
	const client = api.useContext();
	return {
		...query,
		mutate: async (args: {documentIds: string[]}) => {
			await client.documents.getDocuments.invalidate();
			query.mutate(args);
		}
	}
}

async function downloadFile(path: string, filename: string): Promise<void> {
	const result = await fetch(path, {method: 'GET'});
	const blob = await result.blob();
	
	// Create an object URL for the blob object
  const url = URL.createObjectURL(blob);
	
  const a = document.createElement('a');

  a.href = url;
  a.download = filename || 'download';

  const clickHandler = (): void => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      removeEventListener('click', clickHandler);
    }, 150);
  };

  a.addEventListener('click', clickHandler, false);

  a.click();
}