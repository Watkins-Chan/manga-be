/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasModule } from './mangas/mangas.module';
import { GenresModule } from './genres/genres.module';
import { AuthorsModule } from './authors/authors.module';
import { ConfigModule } from '@nestjs/config';
import { ChaptersModule } from './chapters/chapters.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CloudinaryModule,
    MangasModule,
    GenresModule,
    AuthorsModule,
    ChaptersModule,
  ],
})
export class AppModule {}
