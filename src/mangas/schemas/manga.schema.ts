import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Genre } from 'src/genres/schemas/genre.schema';

export type MangaDocument = Manga &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

class Image {
  @IsString()
  name: string;
}

@Schema({ collection: 'list', timestamps: true })
export class Manga {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  genres: Genre[];

  @Prop({ required: true })
  author: string;

  @Prop()
  image?: Image;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
