export type TodoStatus = '未着手' | '進行中' | '完了';

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TodoStatus;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterOptions {
  status?: TodoStatus | 'all' | 'active';
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  tag?: string;
}