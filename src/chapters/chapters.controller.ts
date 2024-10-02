/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter } from './schemas/chapter.schema';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  private static multerOptions = {
    storage: diskStorage({
      destination: './uploads/chapters',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, `${uniqueSuffix}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  };

  @Post()
  @ApiOperation({ summary: 'Create new chapter with images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Images and Chapter information',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        manga: { type: 'string', description: 'Manga ID' },
        chapterNumber: { type: 'number', description: 'Chapter Number' },
        title: { type: 'string', description: 'Chapter Title' },
        releaseDate: {
          type: 'string',
          format: 'date-time',
          description: 'Release date of Chapter',
        },
        author: { type: 'string', description: 'Author ID' },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['manga', 'chapterNumber', 'title', 'images'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Chapter created successfully.',
    type: Chapter,
  })
  @UseInterceptors(
    FilesInterceptor('images', 30, ChaptersController.multerOptions),
  ) // maximum 30 images
  async create(
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Chapter> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required.');
    }

    // Get the path of uploaded files
    const imagePaths = files.map((file) => file.path);

    return this.chaptersService.create(createChapterDto, imagePaths);
  }

  @Get()
  @ApiOperation({ summary: 'Get list Chapters' })
  @ApiQuery({
    name: 'manga',
    required: false,
    description: 'Manga ID for filter Chapters',
  })
  @ApiResponse({
    status: 200,
    description: 'List Chapters.',
    type: [Chapter],
  })
  async findAll(@Query('manga') mangaId?: string): Promise<Chapter[]> {
    return this.chaptersService.findAll(mangaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get information Chapter by ID' })
  @ApiParam({ name: 'id', description: 'Chapter ID' })
  @ApiResponse({
    status: 200,
    description: 'Chapter Information',
    type: Chapter,
  })
  @ApiResponse({ status: 404, description: 'Chapter not found.' })
  async findOne(@Param('id') id: string): Promise<Chapter> {
    return this.chaptersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Chapter Information' })
  @ApiParam({ name: 'id', description: 'Chapter ID' })
  @ApiResponse({
    status: 200,
    description: 'Chapter updated successfully.',
    type: Chapter,
  })
  @ApiResponse({ status: 404, description: 'Chapter not found.' })
  @UseInterceptors(
    FilesInterceptor('images', 30, ChaptersController.multerOptions),
  ) // Maximum 30 images
  async update(
    @Param('id') id: string,
    @Body() updateChapterDto: UpdateChapterDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Chapter> {
    let newImageFilenames: string[] = [];
    // If has upload new images, add its into images[]
    if (files && files.length > 0) {
      newImageFilenames = files.map((file) => file.filename);
    }

    return this.chaptersService.update(id, updateChapterDto, newImageFilenames);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Chapter' })
  @ApiParam({ name: 'id', description: 'Chapter ID' })
  @ApiResponse({ status: 204, description: 'Chapter deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Chapter not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.chaptersService.remove(id);
  }

  @Delete(':id/images')
  @ApiOperation({ summary: 'Delete image in Chapter' })
  @ApiParam({ name: 'id', description: 'Chapter ID' })
  @ApiBody({
    description: 'URL image need remove',
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', description: 'URL image need remove' },
      },
      required: ['imageUrl'],
    },
  })
  @ApiResponse({ status: 200, description: 'Image deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Chapter or image not found.' })
  @HttpCode(HttpStatus.OK)
  async removeImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<{ message: string }> {
    await this.chaptersService.removeImage(id, imageUrl);
    return { message: 'Image removed successfully' };
  }
}
