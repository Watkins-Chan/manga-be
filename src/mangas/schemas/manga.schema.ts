import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Types, Document } from 'mongoose';

export enum MangaStatus {
  PROGRESSING = 'PROGRESSING',
  COMPLETED = 'COMPLETED',
}

export type MangaDocument = Manga &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  collection: 'manga',
  timestamps: true,
})
export class Manga {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop()
  @IsOptional()
  description?: string;

  @Prop({ required: true, enum: MangaStatus, index: true })
  status: MangaStatus;

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: 'Genre',
    default: [],
    index: true,
  })
  genres: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true, index: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
