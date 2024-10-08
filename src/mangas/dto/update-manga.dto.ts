import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateMangaDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  status?: string;

  @IsMongoId()
  @IsNotEmpty()
  author?: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  genres?: Types.ObjectId[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
