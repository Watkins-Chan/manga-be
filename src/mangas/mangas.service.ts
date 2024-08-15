import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manga, MangaDocument } from './schemas/manga.schema';

@Injectable()
export class MangasService {
  constructor(
    @InjectModel(Manga.name) private mangaModel: Model<MangaDocument>,
  ) {}

  // Create a new manga
  async create(createMangaDto: any): Promise<Manga> {
    const createdManga = new this.mangaModel(createMangaDto);
    return createdManga.save();
  }

  // Get many mangas with pagination
  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
  ): Promise<Manga[]> {
    const skip = (currentPage - 1) * pageSize;
    return this.mangaModel.find().skip(skip).limit(pageSize).exec();
  }

  // Get one manga by id
  async findOne(id: string): Promise<Manga> {
    const manga = await this.mangaModel.findById(id).exec();
    if (!manga) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }
    return manga;
  }

  // Update a manga by id
  async update(id: string, updateMangaDto: any): Promise<Manga> {
    const existingManga = await this.mangaModel
      .findByIdAndUpdate(id, updateMangaDto, { new: true })
      .exec();
    if (!existingManga) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }
    return existingManga;
  }

  // Delete a manga by id
  async delete(id: string): Promise<Manga> {
    const deletedManga = await this.mangaModel.findByIdAndDelete(id).exec();
    if (!deletedManga) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }
    return deletedManga;
  }
}
