/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Manga, MangaDocument } from './schemas/manga.schema';
import { Model } from 'mongoose';
import { PaginatedResponse } from './interfaces/mangas.interface';

@Injectable()
export class MangasService {
    constructor(@InjectModel(Manga.name) private mangaModel: Model<MangaDocument>) { }
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
        
        const totalElements = await this.mangaModel.countDocuments(searchQuery);
        
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
