import type { Todo, FilterOptions } from '../types/todo';

export interface TodoContextType {
  todos: Todo[];
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
  addNewTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExistingTodo: (id: number, updates: Partial<Todo>) => Promise<void>;
  deleteTodoItem: (id: number) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  refreshTodos: () => Promise<void>;
}