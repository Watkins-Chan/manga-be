import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Manga ID',
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly manga: string;

  @ApiProperty({
    description: 'Chapter Number',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly chapterNumber: string;

  @ApiProperty({
    description: 'Chapter Title',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  // No need for images field in DTO because it will be uploaded via file
  // We will handle images in controller and service

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
  @IsNotEmpty()
  readonly author: string;
}
