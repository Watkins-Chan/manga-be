/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenreDocument = Genre &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ collection: 'genres', timestamps: true })
export class Genre {
  @Prop({ required: true })
  genre_name: string;

  @Prop()
  description: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
