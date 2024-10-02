import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Manga } from '../../mangas/schemas/manga.schema';
import { Author } from '../../authors/schemas/author.schema';

@Schema({ collection: 'chapters', timestamps: true })
export class Chapter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Manga', required: true })
  manga: Types.ObjectId | Manga;

  @Prop({ required: true })
  chapterNumber: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ default: Date.now })
  releaseDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Author' })
  author: Types.ObjectId | Author;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.index({ manga: 1, chapterNumber: 1 }, { unique: true });
