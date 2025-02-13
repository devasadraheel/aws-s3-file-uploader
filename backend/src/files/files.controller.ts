import { Controller, Post, Get, Body, Query, BadRequestException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignDownloadDto } from './dto/presign-download.dto';
import { FILE_UPLOAD_CONFIG, ERROR_MESSAGES } from '../config/file-upload.config';

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
      
      const url = await this.s3Service.getPresignedPutUrl(key, contentType, FILE_UPLOAD_CONFIG.PRESIGNED_URL_EXPIRY_SECONDS);
      
      this.logger.log(`Generated presigned upload URL for key: ${key}`);
      
      return {
        url,
        key,
        expiresIn: FILE_UPLOAD_CONFIG.PRESIGNED_URL_EXPIRY_SECONDS,
      };
    } catch (error) {
      this.logger.error('Failed to generate presigned upload URL', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(ERROR_MESSAGES.UPLOAD_URL_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('presign-download')
  async presignDownload(@Query() presignDownloadDto: PresignDownloadDto) {
    try {
      const { key } = presignDownloadDto;
      
      const url = await this.s3Service.getPresignedGetUrl(key, FILE_UPLOAD_CONFIG.PRESIGNED_URL_EXPIRY_SECONDS);
      
      this.logger.log(`Generated presigned download URL for key: ${key}`);
      
      return {
        url,
        expiresIn: FILE_UPLOAD_CONFIG.PRESIGNED_URL_EXPIRY_SECONDS,
      };
    } catch (error) {
      this.logger.error('Failed to generate presigned download URL', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(ERROR_MESSAGES.DOWNLOAD_URL_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('head')
  async getFileMetadata(@Query() presignDownloadDto: PresignDownloadDto) {
    try {
      const { key } = presignDownloadDto;
      
      const metadata = await this.s3Service.headObject(key);
      
      this.logger.log(`Retrieved metadata for key: ${key}`);
      
      return metadata;
    } catch (error) {
      this.logger.error('Failed to get file metadata', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(ERROR_MESSAGES.METADATA_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private validateFileUpload(key: string, contentType: string, contentLength: number): void {
    // Check key prefix
    if (!key.startsWith(FILE_UPLOAD_CONFIG.KEY_PREFIX)) {
      throw new BadRequestException(`Key must start with "${FILE_UPLOAD_CONFIG.KEY_PREFIX}"`);
    }

    // Check file size
    if (contentLength > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.FILE_SIZE_EXCEEDED} of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB`
      );
    }

    // Check MIME type
    if (!FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new BadRequestException(`${ERROR_MESSAGES.INVALID_MIME_TYPE}: ${contentType}`);
    }
  }
}
