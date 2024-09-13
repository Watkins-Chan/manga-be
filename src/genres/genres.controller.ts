/* eslint-disable prettier/prettier */
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
import { GenresService } from './genres.service';
import { Genre } from './schemas/genre.schema';
import { PaginatedResponse } from './interfaces/genres.interface';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  // Create a new genre
  @Post()
  async create(@Body() createGenreDto: any): Promise<Genre> {
    return this.genresService.create(createGenreDto);
  }

  // Get many genre with pagination
  @Get()
  async findAll(
    @Query('currentPage') page: string,
    @Query('pageSize') limit: string,
    @Query('q') q: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string
  ): Promise<PaginatedResponse> {
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const sortOrderValue = sortOrder || 'desc';
    return this.genresService.findAll(currentPage, pageSize, q, sortBy, sortOrderValue);
  }

  // Get one genre by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre> {
    return this.genresService.findOne(id);
  }

  // Update a genre by id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: any,
  ): Promise<Genre> {
    return this.genresService.update(id, updateGenreDto);
  }

  // Delete a genre by id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Genre> {
    return this.genresService.delete(id);
  }
}
