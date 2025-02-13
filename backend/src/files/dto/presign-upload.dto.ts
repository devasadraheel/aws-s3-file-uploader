import { IsString, IsNotEmpty, IsNumber, Min, Max, Matches } from 'class-validator';
import { FILE_UPLOAD_CONFIG, ERROR_MESSAGES } from '../../config/file-upload.config';

export class PresignUploadDto {
  @IsString()
  @IsNotEmpty()
  @Matches(FILE_UPLOAD_CONFIG.KEY_PATTERN, {
    message: ERROR_MESSAGES.INVALID_KEY_FORMAT,
  })
  key: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @Min(1)
  @Max(FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES)
  contentLength: number;
}
