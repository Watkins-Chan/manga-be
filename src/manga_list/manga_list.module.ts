import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MangaList } from './entities/manga_list.entity';
import { MangaListService } from './manga_list.service';
import { MangaListController } from './manga_list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MangaList])],
  providers: [MangaListService],
  controllers: [MangaListController],
})
export class MangaListModule {}
