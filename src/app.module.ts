/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasModule } from './mangas/mangas.module';
import { GenresModule } from './genres/genres.module';
import { AuthorsModule } from './authors/authors.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MangasModule,
    GenresModule,
    AuthorsModule,
  ],
})
export class AppModule {}
