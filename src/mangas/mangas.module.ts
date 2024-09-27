/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from './schemas/manga.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    ConfigModule
  ],
  controllers: [MangasController],
  providers: [MangasService]
})
export class MangasModule {}
