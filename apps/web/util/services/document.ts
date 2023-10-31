import {uploadFileGroup} from '@uploadcare/upload-client'

export const useUploadDocument = () => {
	return {
		upload: async (patientId: string, fileList: FileList) => {
			const files: File[] = [...new Array<number>(fileList.length)].map((_, i) => fileList[i]);
			const result = await uploadFileGroup(files, {
				publicKey: process.env.UPLOAD_CARE_PUBLIC_KEY,
				store: 'auto'
			});

			return result;
		}
	}
}	