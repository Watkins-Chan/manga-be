/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { Manga, MangaSchema } from 'src/mangas/schemas/manga.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }, { name: Manga.name, schema: MangaSchema }]),
  ],
  providers: [ChaptersService],
  controllers: [ChaptersController],
  exports: [ChaptersService]
})
export class ChaptersModule {}
