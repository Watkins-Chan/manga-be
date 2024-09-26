/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedResponse } from './interfaces/mangas.interface';
import { MangasService } from './mangas.service';
import { Manga } from './schemas/manga.schema';

const DEFAULT_PAGE_SIZE = 12
const DEFAULT_CURRENT_PAGE = 1
@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Get()
  async findAll(
    @Query('currentPage') page: string,
    @Query('pageSize') limit: string,
    @Query('q') q: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
  ): Promise<PaginatedResponse> {
    const currentPage = parseInt(page, 10) || DEFAULT_CURRENT_PAGE;
    const pageSize = parseInt(limit, 10) || DEFAULT_PAGE_SIZE;
    const sortOrderValue = sortOrder || 'desc';
    return this.mangasService.findAll(
      currentPage,
      pageSize,
      q,
      sortBy,
      sortOrderValue,
    );
  }

  @Post()
  async create(@Body() createMangaDto: any): Promise<Manga> {
    return this.mangasService.create(createMangaDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.mangasService.uploadMangasFromExcel(file);
    return result;
  }

  @Delete()
  async deleteMany() {
    const result = await this.mangasService.deleteMany();
    return result
  }

}
