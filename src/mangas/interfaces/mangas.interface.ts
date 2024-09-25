import { Manga } from '../schemas/manga.schema';

interface PageInfo {
  _totalElements: number;
  _currentPage: number;
  _pageSize: number;
  _totalPages: number;
}

export interface PaginatedResponse {
  data: Manga[];
  timestamp: string;
  page: PageInfo;
}
