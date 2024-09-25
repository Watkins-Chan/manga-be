/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Author } from 'src/authors/schemas/author.schema';
import { Genre } from 'src/genres/schemas/genre.schema';

export type MangaDocument = Manga & Document & {
  createdAt: Date;
  updatedAt: Date;
};

class Image {
  @IsString()
  url: string;
}

@Schema({ collection: 'list', timestamps: true })
export class Manga {
  @Prop({ required: true })
  name: string;

  @Prop()
  @IsOptional()
  description?: string;

  @Prop()
  status: string;

  @Prop({ required: true })
  genres: Genre[];

  @Prop({ required: true })
  author: Author

  @Prop({ required: true })
  image: Image
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
