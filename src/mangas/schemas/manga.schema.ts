import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Genre } from 'src/genres/schemas/genre.schema';

export type MangaDocument = Manga &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ collection: 'list', timestamps: true })
export class Manga {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  status: string;

  @Prop()
  genres: Genre[];

  @Prop()
  author: string;

  @Prop()
  imageUrl: string;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
