import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PresignUploadRequest {
  key: string;
  contentType: string;
  contentLength: number;
}

export interface PresignUploadResponse {
  url: string;
  key: string;
  expiresIn: number;
}

export interface PresignDownloadResponse {
  url: string;
  expiresIn: number;
}

export interface FileMetadata {
  contentLength: number;
  contentType: string;
  lastModified: string;
  etag: string;
}

export const filesApi = {
  // Get presigned URL for file upload
  presignUpload: async (data: PresignUploadRequest): Promise<PresignUploadResponse> => {
    const response = await api.post('/files/presign-upload', data);
    return response.data;
  },

  // Upload file to S3 using presigned URL
  uploadFileToS3: async (
    presignedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // Get presigned URL for file download
  presignDownload: async (key: string): Promise<PresignDownloadResponse> => {
    const response = await api.get('/files/presign-download', {
      params: { key },
    });
    return response.data;
  },

  // Get file metadata
  getFileMetadata: async (key: string): Promise<FileMetadata> => {
    const response = await api.get('/files/head', {
      params: { key },
    });
    return response.data;
  },
};
