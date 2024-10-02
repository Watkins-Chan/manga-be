import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsMongoId,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @ApiPropertyOptional({
    description: 'Manga ID',
    type: String,
  })
  @IsMongoId()
  @IsOptional()
  readonly manga?: string;

  @ApiPropertyOptional({
    description: 'Chapter Number',
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly chapterNumber?: string;

  @ApiPropertyOptional({
    description: 'Chapter Title',
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({
    description: 'Release date of Chapter',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  readonly releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Author ID',
    type: String,
  })
  @IsMongoId()
  @IsOptional()
  readonly author?: string;

  @ApiPropertyOptional({
    description: 'List URL image',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly images?: string[];
}
