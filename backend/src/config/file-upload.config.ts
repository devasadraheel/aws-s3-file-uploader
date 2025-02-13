export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ],
  KEY_PREFIX: 'uploads/',
  PRESIGNED_URL_EXPIRY_SECONDS: 3600, // 1 hour
  KEY_PATTERN: /^uploads\/[a-zA-Z0-9\-_]+\.\w+$/,
} as const;

export const ERROR_MESSAGES = {
  INVALID_KEY_FORMAT: 'Key must start with "uploads/" and contain only alphanumeric characters, hyphens, underscores, and a valid file extension',
  FILE_SIZE_EXCEEDED: 'File size exceeds maximum limit',
  INVALID_MIME_TYPE: 'File type is not allowed',
  UPLOAD_URL_FAILED: 'Failed to generate upload URL',
  DOWNLOAD_URL_FAILED: 'Failed to generate download URL',
  METADATA_FAILED: 'Failed to get file metadata',
} as const;
