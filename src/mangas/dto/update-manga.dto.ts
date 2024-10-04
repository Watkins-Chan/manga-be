import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsMongoId,
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

  genres?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
