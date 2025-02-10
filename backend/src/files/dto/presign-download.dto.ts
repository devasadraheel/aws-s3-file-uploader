import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class PresignDownloadDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^uploads\/[a-zA-Z0-9\-_]+\.\w+$/, {
    message: 'Key must start with "uploads/" and contain only alphanumeric characters, hyphens, underscores, and a valid file extension',
  })
  key: string;
}
