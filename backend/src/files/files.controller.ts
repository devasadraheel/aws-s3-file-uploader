import { Controller, Post, Get, Body, Query, BadRequestException, Logger } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignDownloadDto } from './dto/presign-download.dto';

@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly s3Service: S3Service) {}

  @Post('presign-upload')
  async presignUpload(@Body() presignUploadDto: PresignUploadDto) {
    try {
      const { key, contentType, contentLength } = presignUploadDto;
      
      // Additional validation
      this.validateFileUpload(key, contentType, contentLength);
      
      const url = await this.s3Service.getPresignedPutUrl(key, contentType);
      
      return {
        url,
        key,
        expiresIn: 3600, // 1 hour
      };
    } catch (error) {
      this.logger.error('Failed to generate presigned upload URL', error);
      throw new BadRequestException('Failed to generate upload URL');
    }
  }

  @Get('presign-download')
  async presignDownload(@Query() presignDownloadDto: PresignDownloadDto) {
    try {
      const { key } = presignDownloadDto;
      
      const url = await this.s3Service.getPresignedGetUrl(key);
      
      return {
        url,
        expiresIn: 3600, // 1 hour
      };
    } catch (error) {
      this.logger.error('Failed to generate presigned download URL', error);
      throw new BadRequestException('Failed to generate download URL');
    }
  }

  @Get('head')
  async getFileMetadata(@Query() presignDownloadDto: PresignDownloadDto) {
    try {
      const { key } = presignDownloadDto;
      
      const metadata = await this.s3Service.headObject(key);
      
      return metadata;
    } catch (error) {
      this.logger.error('Failed to get file metadata', error);
      throw new BadRequestException('Failed to get file metadata');
    }
  }

  private validateFileUpload(key: string, contentType: string, contentLength: number): void {
    // Check key prefix
    if (!key.startsWith('uploads/')) {
      throw new BadRequestException('Key must start with "uploads/"');
    }

    // Check file size (10MB limit)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (contentLength > maxSizeBytes) {
      throw new BadRequestException(`File size exceeds maximum limit of ${maxSizeBytes / (1024 * 1024)}MB`);
    }

    // Check MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];
    
    if (!allowedMimeTypes.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} is not allowed`);
    }
  }
}
