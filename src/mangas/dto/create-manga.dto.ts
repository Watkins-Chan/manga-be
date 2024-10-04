// src/manga/dto/create-manga.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateMangaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsMongoId()
  author: string;

  @IsArray()
  genres: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
