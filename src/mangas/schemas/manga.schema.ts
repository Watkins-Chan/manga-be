import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Author } from 'src/authors/schemas/author.schema';
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

  @Prop({ required: true, type: [Types.ObjectId], ref: 'Genre' })
  genres: Types.ObjectId[] | Genre[];

  @Prop({ type: Types.ObjectId, ref: 'Author' })
  author: Types.ObjectId | Author;

  @Prop()
  imageUrl: string;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
