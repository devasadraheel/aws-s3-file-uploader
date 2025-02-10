import { IsString, IsNotEmpty, IsNumber, Min, Max, Matches } from 'class-validator';

export class PresignUploadDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^uploads\/[a-zA-Z0-9\-_]+\.\w+$/, {
    message: 'Key must start with "uploads/" and contain only alphanumeric characters, hyphens, underscores, and a valid file extension',
  })
  key: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @Min(1)
  @Max(10 * 1024 * 1024) // 10MB in bytes
  contentLength: number;
}
