/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { MangaList } from './entities/manga_list.entity';
import { MangaListService } from './manga_list.service';

@Controller('manga-list')
export class MangaListController {
  constructor(private readonly mangaListService: MangaListService) {}

  @Get()
  findAll(): Promise<MangaList[]> {
    return this.mangaListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<MangaList> {
    return this.mangaListService.findOne(id);
  }

  @Post()
  create(@Body() manga: Partial<MangaList>): Promise<MangaList> {
    return this.mangaListService.createManga(manga);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.mangaListService.remove(id);
  }
}
