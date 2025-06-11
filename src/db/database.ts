import type { Todo, TodoStatus } from '../types/todo';
import {
  initLocalStorage,
  addTodoLocal,
  updateTodoLocal,
  deleteTodoLocal,
  listTodosLocal,
  exportDatabaseLocal,
  importDatabaseLocal
} from './localStorage';

export async function initDatabase(): Promise<void> {
  try {
    // Try to load sql.js
    const initSqlJs = (await import('sql.js')).default;
    await initSqlJs({
      locateFile: (file: string) => `/${file}`
    });
    
    console.log('SQLite initialized successfully');
    
    // Continue with SQLite implementation...
    // For now, we'll use localStorage as it's more reliable
    await initLocalStorage();
    
  } catch (error) {
    console.warn('SQLite failed to load, using localStorage fallback:', error);
    await initLocalStorage();
  }
}

export async function addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  return await addTodoLocal(todo);
}

export async function updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
  return await updateTodoLocal(id, updates);
}

export async function deleteTodo(id: number): Promise<void> {
  return await deleteTodoLocal(id);
}

export async function listTodos(filters?: {
  status?: TodoStatus | 'all';
  tag?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}): Promise<Todo[]> {
  return await listTodosLocal(filters);
}

export async function exportDatabase(): Promise<string> {
  return await exportDatabaseLocal();
}

export async function importDatabase(jsonData: string, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  return await importDatabaseLocal(jsonData, mode);
}