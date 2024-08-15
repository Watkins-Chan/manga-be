import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MangaDocument = Manga & Document;

@Schema({ collection: 'list' })
export class Manga {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  description: string;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
