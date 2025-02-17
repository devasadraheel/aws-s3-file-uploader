import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'default-bucket';

    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'dummy-key';
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'dummy-secret';

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getPresignedPutUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Generated presigned PUT URL for key: ${key}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned PUT URL for key: ${key}`,
        error,
      );
      throw error;
    }
  }

  async getPresignedGetUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Generated presigned GET URL for key: ${key}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned GET URL for key: ${key}`,
        error,
      );
      throw error;
    }
  }

  async headObject(key: string): Promise<{
    contentLength: number;
    contentType: string;
    lastModified: Date;
    etag: string;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      this.logger.log(`Retrieved object metadata for key: ${key}`);
      return {
        contentLength: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        lastModified: response.LastModified || new Date(),
        etag: response.ETag || '',
      };
    } catch (error) {
      this.logger.error(`Failed to get object metadata for key: ${key}`, error);
      throw error;
    }
  }
}
