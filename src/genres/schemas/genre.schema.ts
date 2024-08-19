import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenreDocument = Genre & Document;

@Schema({ collection: 'genre' })
export class Genre {
  @Prop({ required: true })
  genre_name: string;

  @Prop()
  description: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
