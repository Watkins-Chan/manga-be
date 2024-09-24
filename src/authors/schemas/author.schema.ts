/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export type AuthorDocument = Author &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

class Work {
  @IsString({ message: 'Work name must be a string' })
  name: string;
}

@Schema({ collection: 'authors', timestamps: true })
export class Author {
  @Prop({ required: true })
  author_name: string;

  @Prop()
  @IsOptional()
  description?: string;

  @Prop({ required: true })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Prop({ required: true })
  @Matches(/^[0-9]*$/, { message: 'Phone number must contain only numbers' })
  @Length(10, 15, { message: 'Phone number must be between 10 and 15 digits' })
  phone: string;

  @Prop({ type: [{ name: String }] })
  @IsOptional()
  @IsArray({ message: 'Works must be an array' })
  @ValidateNested({ each: true })
  @Type(() => Work)
  works?: Work[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
