/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model } from 'mongoose';
import { PaginatedResponse } from './interfaces/authors.interface';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

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
          $or: [{ author_name: { $regex: q, $options: 'i' } }],
        }
      : {};
    const totalElements = await this.authorModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalElements / pageSize);
    if (currentPage > totalPages) {
      currentPage = 1;
    }

    let sortOptions: any = {};
    switch (sortBy) {
      case 'createdAt':
        sortOptions = { createdAt: sortOrder === 'desc' ? 1 : -1 };
      case 'name':
        sortOptions = { author_name: sortOrder === 'asc' ? 1 : -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    const data = await this.authorModel
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
