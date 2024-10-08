import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class UpdateMangaDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsMongoId()
  author?: string;

  @IsArray()
  genres?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
