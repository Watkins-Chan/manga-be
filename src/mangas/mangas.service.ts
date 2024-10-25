/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Manga, MangaDocument } from './schemas/manga.schema';
import { Model, Types } from 'mongoose';
import { PaginatedResponse } from './interfaces/mangas.interface';
import * as XLSX from 'xlsx';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class MangasService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Manga.name) private mangaModel: Model<MangaDocument>,
  ) {}

  async uploadImageToCloudinary(input: string | Express.Multer.File): Promise<string> {
    return this.cloudinaryService.uploadImage(input);
  }

  async uploadMangasFromExcel(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    // random date time
    const getRandomDateBeforeNow = (existingDates: Set<number>): Date => {
      const now = new Date();
      let randomTimestamp: number;

      do {
        randomTimestamp = Math.floor(Math.random() * now.getTime());
      } while (existingDates.has(randomTimestamp));

      existingDates.add(randomTimestamp);
      return new Date(randomTimestamp);
    };

    const existingDates = new Set<number>();

    const bulkInsertData = await Promise.all(
      data.map(async (row: any) => {
        const { name, description, status, genres, author, image } = row;

        if (typeof author !== 'string' || !Types.ObjectId.isValid(author)) {
          throw new BadRequestException(`Invalid author ID: ${author}`);
        }
        const idAuthor = new Types.ObjectId(author);

        if (typeof genres !== 'string' || !Types.ObjectId.isValid(genres)) {
          throw new BadRequestException(`Invalid genres ID: ${genres}`);
        }
        const idGenres = new Types.ObjectId(genres);

        let imageUrl: string;
        if (typeof image === 'string') {
          imageUrl = await this.uploadImageToCloudinary(image);
        } else {
          throw new BadRequestException(`Invalid image format for manga: ${name}`);
        }

        return {
          name,
          description,
          status,
          genres: [idGenres],
          author: idAuthor,
          imageUrl,
          createdAt: getRandomDateBeforeNow(existingDates),
        };
      }),
    );

    if (bulkInsertData.length) {
      await this.mangaModel.insertMany(bulkInsertData);
    }

    return { message: 'Mangas uploaded and saved successfully' };
  }

  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
    q: string = '',
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Promise<PaginatedResponse> {
    const skip = (currentPage - 1) * pageSize;
    const searchQuery = q
      ? {
          $or: [{ name: { $regex: q, $options: 'i' } }],
        }
      : {};

    const totalElements = await this.mangaModel.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalElements / pageSize);

    if (currentPage > totalPages) {
      currentPage = 1;
    }

    let sortOptions: any = {};
    switch (sortBy) {
      case 'createdAt':
        sortOptions = { createdAt: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'name':
        sortOptions = { name: sortOrder === 'asc' ? 1 : -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const data = await this.mangaModel
      .find(searchQuery)
      .populate('author')
      .populate('genres')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .exec();

    return {
      data,
      timestamp: new Date().toISOString(),
      page: {
        _totalElements: totalElements,
        _currentPage: currentPage,
        _pageSize: pageSize,
        _totalPages: totalPages,
      },
    };
  }

  // Get one manga by id
  async findOne(id: string): Promise<Manga> {
    const manga = await this.mangaModel
      .findById(id)
      .populate('author')
      .populate('genres')
      .exec();
    if (!manga) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }
    return manga;
  }

  async create(
    createMangaDto: CreateMangaDto,
    file?: Express.Multer.File,
  ): Promise<Manga> {
    let imageUrl = createMangaDto.imageUrl;

    if (file) {
      imageUrl = await this.uploadImageToCloudinary(file);
    } else if (imageUrl) {
      imageUrl = await this.uploadImageToCloudinary(imageUrl);
    }

    if (!imageUrl) {
      throw new HttpException(
        'Image is required either as file or URL',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdManga = new this.mangaModel({
      ...createMangaDto,
      author: new Types.ObjectId(createMangaDto.author),
      genres: createMangaDto.genres.map((genre) => new Types.ObjectId(genre)),
      imageUrl,
    });
    return createdManga.save();
  }

  async update(
    id: string,
    updateMangaDto: UpdateMangaDto,
    file?: Express.Multer.File,
  ): Promise<Manga> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Manga not found');
    }

    const manga = await this.mangaModel.findById(id).exec();
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    if (file) {
      const newImageUrl = await this.uploadImageToCloudinary(file);
      if (newImageUrl) {
        updateMangaDto.imageUrl = newImageUrl;
      }
    } else if (updateMangaDto.imageUrl) {
      const newImageUrl = await this.uploadImageToCloudinary(
        updateMangaDto.imageUrl,
      );
      if (newImageUrl) {
        updateMangaDto.imageUrl = newImageUrl;
      }
    }

    if (updateMangaDto.imageUrl === undefined && !manga.imageUrl) {
      throw new HttpException(
        'Image is required either as file or URL',
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(manga, updateMangaDto);
    return manga.save();
  }

  async delete(id: string): Promise<Manga> {
    const deletedManga = await this.mangaModel.findByIdAndDelete(id).exec();
    if (!deletedManga) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }
    return deletedManga;
  }

  async deleteMany(): Promise<{ data: any; timestamp: Date }> {
    await this.mangaModel.deleteMany();
    return { data: {}, timestamp: new Date() };
  }
}
