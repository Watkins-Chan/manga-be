// src/manga/dto/create-manga.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateMangaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsNotEmpty()
  @IsMongoId()
  author: Types.ObjectId;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsMongoId({ each: true })
  genres: Types.ObjectId[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
