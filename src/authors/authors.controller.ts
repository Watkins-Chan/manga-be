/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { PaginatedResponse } from './interfaces/authors.interface';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

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
    return this.authorsService.findAll(
      currentPage,
      pageSize,
      q,
      sortBy,
      sortOrderValue,
    );
  }
}
