import { Author } from '../schemas/author.schema';

interface PageInfo {
  _totalElements: number;
  _currentPage: number;
  _pageSize: number;
  _totalPages: number;
}

export interface PaginatedResponse {
  data: Author[];
  timestamp: string;
  page: PageInfo;
}
