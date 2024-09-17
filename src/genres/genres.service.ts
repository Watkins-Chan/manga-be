/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreDocument, Genre } from './schemas/genre.schema';
import { PaginatedResponse } from './interfaces/genres.interface';
import * as XLSX from 'xlsx';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  async uploadGenresFromExcel(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data as Genre[]) {
      const { genre_name, description } = row;
      if (genre_name) {
        await this.create({ genre_name, description });
      }
    }

    return { message: 'Genres uploaded and saved successfully' };
  }
  
  // Create a new genre
  async create(createGenreDto: any): Promise<Genre> {
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  // Get many genre with pagination
  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
    q: string = '',
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc'
  ): Promise<PaginatedResponse> {
    const skip = (currentPage - 1) * pageSize;
    const searchQuery = q
    ? {
        $or: [
          { genre_name: { $regex: q, $options: 'i' } },
        ],
      }
    : {};
    
    const totalElements = await this.genreModel.countDocuments(searchQuery);
    
    const totalPages = Math.ceil(totalElements / pageSize);

    if (currentPage > totalPages) {
      currentPage = 1;
    }
  
    let sortOptions: any = {}
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

    const data = await this.genreModel
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

  // Get one genre by id
  async findOne(id: string): Promise<Genre> {
    const genre = await this.genreModel.findById(id).exec();
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return genre;
  }

  // Update a genre by id
  async update(id: string, updateGenreDto: any): Promise<Genre> {
    const existingGenre = await this.genreModel
      .findByIdAndUpdate(id, updateGenreDto, { new: true })
      .exec();
    if (!existingGenre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return existingGenre;
  }

  // Delete a genre by id
  async delete(id: string): Promise<Genre> {
    const deletedGenre = await this.genreModel.findByIdAndDelete(id).exec();
    if (!deletedGenre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return deletedGenre;
  }
}
