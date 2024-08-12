/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangaList } from './entities/manga_list.entity';

@Injectable()
export class MangaListService {
  constructor(
    @InjectRepository(MangaList)
    private mangaListRepository: Repository<MangaList>,
  ) {}

  findAll(): Promise<MangaList[]> {
    return this.mangaListRepository.find();
  }

  findOne(id: number): Promise<MangaList> {
    return this.mangaListRepository.findOneBy({ id });
  }

  async createManga(manga: Partial<MangaList>): Promise<MangaList> {
    const newManga = this.mangaListRepository.create(manga);
    return this.mangaListRepository.save(newManga);
  }

  async remove(id: number): Promise<void> {
    await this.mangaListRepository.delete(id);
  }
}
