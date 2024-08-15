import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasModule } from './mangas/mangas.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/manga_db'),
    MangasModule,
  ],
})
export class AppModule {}
