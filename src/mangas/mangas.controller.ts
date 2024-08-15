import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MangasService } from './mangas.service';
import { Manga } from './schemas/manga.schema';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  // Create a new manga
  @Post()
  async create(@Body() createMangaDto: any): Promise<Manga> {
    return this.mangasService.create(createMangaDto);
  }

  // Get many mangas with pagination
  @Get()
  async findAll(
    @Query('currentPage') page: string,
    @Query('pageSize') limit: string,
  ): Promise<Manga[]> {
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10; // Giá trị mặc định là 10
    return this.mangasService.findAll(currentPage, pageSize);
  }

  // Get one manga by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Manga> {
    return this.mangasService.findOne(id);
  }

  // Update a manga by id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMangaDto: any,
  ): Promise<Manga> {
    return this.mangasService.update(id, updateMangaDto);
  }

  // Delete a manga by id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Manga> {
    return this.mangasService.delete(id);
  }
}
