import { IsString } from 'class-validator';

export class CreateMangaDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsString()
  cover_image: string;
}
