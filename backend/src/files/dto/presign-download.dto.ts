import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { FILE_UPLOAD_CONFIG, ERROR_MESSAGES } from '../../config/file-upload.config';

export class PresignDownloadDto {
  @IsString()
  @IsNotEmpty()
  @Matches(FILE_UPLOAD_CONFIG.KEY_PATTERN, {
    message: ERROR_MESSAGES.INVALID_KEY_FORMAT,
  })
  key: string;
}
