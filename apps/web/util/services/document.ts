export const useUploadDocument = () => {
	return {
		upload: async (patientId: string, fileList: FileList) => {
			const files: File[] = [...new Array<number>(fileList.length)].map((_, i) => fileList[i]);
			const formData = new FormData();
			formData.append('patientId', patientId);
			for (const file of files) {
				formData.append(file.name, file);
			}
			await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			//return result;
		}
	}
}	