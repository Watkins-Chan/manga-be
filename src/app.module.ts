/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasModule } from './mangas/mangas.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://minhuy2303:Onepiece2302!@cluster0.allp9.mongodb.net/manga_db?retryWrites=true&w=majority',
    ),
    MangasModule,
    GenresModule,
  ],
})
export class AppModule {}
