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
  // ParseFilePipe,
  // FileTypeValidator,
  // MaxFileSizeValidator,
  HttpException, HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedResponse } from './interfaces/mangas.interface';
import { MangasService } from './mangas.service';
import { Manga } from './schemas/manga.schema';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Manga> {
    return this.mangasService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new HttpException('Chỉ cho phép tải lên file ảnh (jpg, jpeg, png)', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
  }))
  async create(
    @Body() createMangaDto: CreateMangaDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Manga> {
    try {
      const manga = await this.mangasService.create(createMangaDto, file);
      return manga;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new HttpException('Chỉ cho phép tải lên file ảnh (jpg, jpeg, png)', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
  }))
  async update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Manga> {
    try {
      const manga = await this.mangasService.update(id, updateMangaDto, file);
      return manga;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
        return cb(new HttpException('Chỉ cho phép tải lên file Excel', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.mangasService.uploadMangasFromExcel(file);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Manga> {
    return this.mangasService.delete(id);
  }

  @Delete()
  async deleteMany() {
    const result = await this.mangasService.deleteMany();
    return result
  }

}
