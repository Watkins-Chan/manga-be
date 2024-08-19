import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  // Create a new genre
  async create(createGenreDto: any): Promise<Genre> {
    // console.log('createGenreDto', createGenreDto);
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  // Get many genre with pagination
  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
  ): Promise<Genre[]> {
    const skip = (currentPage - 1) * pageSize;
    return this.genreModel.find().skip(skip).limit(pageSize).exec();
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
