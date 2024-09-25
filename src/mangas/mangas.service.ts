/* eslint-disable prettier/prettier */
import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Manga, MangaDocument } from './schemas/manga.schema';
import mongoose, { Model } from 'mongoose';
import { PaginatedResponse } from './interfaces/mangas.interface';
import * as XLSX from 'xlsx';

@Injectable()
export class MangasService {
  constructor(
    @InjectModel(Manga.name) private mangaModel: Model<MangaDocument>,
  ) {}

  async uploadMangasFromExcel(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data as Manga[]) {
      const { name, description, status, genres, author, image } = row;
      console.log("🚀 ~ MangasService ~ uploadMangasFromExcel ~ name:", genres)
      const transformGenres = Array.isArray(genres)
      ? genres.map(genre => ({ name: genre, _id: new mongoose.Types.ObjectId() }))
      : [];
      const transformImage = { url: image, _id: new mongoose.Types.ObjectId() }
      if (name) {
        console.log("🚀 ~ MangasService ~ uploadMangasFromExcel ~ name:", name)
        await this.create({ name, description, status, genres: transformGenres, author, image: transformImage });
      }
    }
    return { message: 'Mangas uploaded and saved successfully' };
  }

  // async uploadMangasFromExcel(file: Express.Multer.File): Promise<any> {
  //   if (!file || !file.buffer) {
  //     throw new BadRequestException('No file uploaded');
  //   }
  
  //   const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  //   const sheetName = workbook.SheetNames[0];
  //   const worksheet = workbook.Sheets[sheetName];
  
  //   const data = XLSX.utils.sheet_to_json(worksheet);
  
  //   const bulkInsertData = data.map((row: Manga) => {
  //     const { name, description, status, genres, author, image } = row;
  
  //     const transformGenres = Array.isArray(genres)
  //       ? genres.map(genre => ({ name: genre, _id: new mongoose.Types.ObjectId() }))
  //       : [];
  
  //     const transformAuthor = { name: author, _id: new mongoose.Types.ObjectId() };
  //     const transformImage = { url: image, _id: new mongoose.Types.ObjectId() };
  
  //     return { name, description, status, genres: transformGenres, author: transformAuthor, image: transformImage };
  //   });
  
  //   // Thực hiện bulk insert
  //   if (bulkInsertData.length) {
  //     await this.mangaModel.insertMany(bulkInsertData); // Assuming this.mangaModel is the mongoose model for Manga
  //   }
  
  //   return { message: 'Mangas uploaded and saved successfully' };
  // }
  async create(createMangaDto: any): Promise<Manga> {
    const createdManga = new this.mangaModel(createMangaDto);
    return createdManga.save();
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
          $or: [{ genre_name: { $regex: q, $options: 'i' } }],
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
        sortOptions = { genre_name: sortOrder === 'asc' ? 1 : -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const data = await this.mangaModel
      .find(searchQuery)
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
}
