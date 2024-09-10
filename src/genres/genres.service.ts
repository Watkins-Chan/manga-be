/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreDocument, Genre } from './schemas/genre.schema';
import { PaginatedResponse } from './interfaces/genres.interface';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  // Create a new genre
  async create(createGenreDto: any): Promise<Genre> {
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  // Get many genre with pagination
  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse> {
    const skip = (currentPage - 1) * pageSize;
    
    const totalElements = await this.genreModel.countDocuments();
    
    const totalPages = Math.ceil(totalElements / pageSize);
    if (currentPage > totalPages) {
      currentPage = 1;
    }
  
    const data = await this.genreModel
      .find()
      .sort({ createdAt: -1 })
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
