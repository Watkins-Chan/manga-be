/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, Body, Delete, Query  } from '@nestjs/common';
import { MangaList } from './entities/manga_list.entity';
import { MangaListService } from './manga_list.service';
import { CreateMangaDto } from './dto/create_manga.dto';

@Controller('manga-list')
export class MangaListController {
  constructor(private readonly mangaListService: MangaListService) {}

  @Get()
  async getPaginatedMangaList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mangaListService.getPaginatedMangaList(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MangaList> {
    return this.mangaListService.findOne(id);
  }

  @Post()
  async createManga(@Body() createMangaDto: CreateMangaDto) {
    return this.mangaListService.createManga(createMangaDto);
  }

  @Post('bulk')
  async createManyManga(@Body() createManyMangaDto: CreateMangaDto[]) {
    return this.mangaListService.createManyManga(createManyMangaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.mangaListService.remove(id);
  }
}
