'use client';

import { useState } from 'react';
import { filesApi } from '@/lib/api';
import { UploadedFile } from '@/app/upload/page';

interface FileListProps {
  files: UploadedFile[];
}

export default function FileList({ files }: FileListProps) {
  const [downloadingKeys, setDownloadingKeys] = useState<Set<string>>(new Set());

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type === 'application/pdf') {
      return '📄';
    } else if (type === 'text/plain') {
      return '📝';
    }
    return '📁';
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      setDownloadingKeys(prev => new Set(prev).add(file.key));
      
      const { url } = await filesApi.presignDownload(file.key);
      
      // Open download URL in new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.key);
        return newSet;
      });
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No files uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Uploaded Files ({files.length})
      </h2>
      
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.key}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleDownload(file)}
              disabled={downloadingKeys.has(file.key)}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingKeys.has(file.key) ? 'Getting link...' : 'Download'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
