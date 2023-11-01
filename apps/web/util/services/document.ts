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