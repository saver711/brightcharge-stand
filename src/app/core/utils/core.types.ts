export interface Page<T> {
  //Page Request fields
  pageSize?: number;
  pageNum?: number;
  sortField?: string;
  sortOrder?: number;
  filters?: { field: string; operation: string; value: string[] | any }[];
  //Page Response fields
  content?: T[];
  totalElements?: number;
}

export interface LoginRequest {
  userName: string;
  password: string;
  deviceToken?: string;
}

export type LanguageKey = 'ar' | 'en';
