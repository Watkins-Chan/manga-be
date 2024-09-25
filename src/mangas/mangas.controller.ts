/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedResponse } from './interfaces/mangas.interface';
import { MangasService } from './mangas.service';

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
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const sortOrderValue = sortOrder || 'desc';
    return this.mangasService.findAll(
      currentPage,
      pageSize,
      q,
      sortBy,
      sortOrderValue,
    );
  }
}
