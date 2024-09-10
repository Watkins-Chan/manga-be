import { Genre } from '../schemas/genre.schema';

interface PageInfo {
  _totalElements: number;
  _currentPage: number;
  _pageSize: number;
  _totalPages: number;
}

export interface PaginatedResponse {
  data: Genre[];
  timestamp: string;
  page: PageInfo;
}
