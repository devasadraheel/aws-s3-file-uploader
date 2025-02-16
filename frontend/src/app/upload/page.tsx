"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";

export interface UploadedFile {
    key: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: Date;
}

export default function UploadPage() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleFileUploaded = (file: UploadedFile) => {
        setUploadedFiles(prev => [file, ...prev]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AWS S3 File Uploader</h1>
                    <p className="text-gray-600">Upload files directly to S3 using presigned URLs</p>
                </div>

                <div className="space-y-8">
                    <FileUploader onFileUploaded={handleFileUploaded} />
                    <FileList files={uploadedFiles} />
                </div>
            </div>
        </div>
    );
}
