/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangaList } from './entities/manga_list.entity';
import { CreateMangaDto } from './dto/create_manga.dto';

@Injectable()
export class MangaListService {
  constructor(
    @InjectRepository(MangaList)
    private mangaListRepository: Repository<MangaList>,
  ) {}

  async getPaginatedMangaList(page?: number, limit?: number) {
    if (page && limit) {
      const offset = (page - 1) * limit;
      const [results, total] = await this.mangaListRepository.findAndCount({
        skip: offset,
        take: limit,
        order: { id: 'DESC' },
      });

      return {
        total,
        page,
        limit,
        data: results,
      };
    } else {
      const results = await this.mangaListRepository.find({
        order: { id: 'DESC' },
      });

      return {
        total: results.length,
        data: results,
      };
    }
  }

  findOne(id: string): Promise<MangaList> {
    return this.mangaListRepository.findOneBy({ id });
  }

  async createManga(createMangaDto: CreateMangaDto): Promise<MangaList> {
    const manga = this.mangaListRepository.create(createMangaDto);
    return await this.mangaListRepository.save(manga);
  }

  async createManyManga(createManyMangaDto: CreateMangaDto[]): Promise<MangaList[]> {
    const mangas = this.mangaListRepository.create(createManyMangaDto);
    return await this.mangaListRepository.save(mangas);
  }

  async remove(id: number): Promise<void> {
    await this.mangaListRepository.delete(id);
  }
}
