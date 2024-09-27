// src/manga/dto/create-manga.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  // IsArray,
  // ArrayNotEmpty
} from 'class-validator';

export class CreateMangaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  //   @IsNotEmpty()
  description: string;

  @IsString()
  //   @IsNotEmpty()
  status: string;

  @IsString()
  //   @IsNotEmpty()
  author: string;

  // @IsArray()
  //   @ArrayNotEmpty()
  genres: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
