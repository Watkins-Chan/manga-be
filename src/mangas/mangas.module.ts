import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';
import { Manga, MangaSchema } from './schemas/manga.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
  ],
  controllers: [MangasController],
  providers: [MangasService],
})
export class MangasModule {}
