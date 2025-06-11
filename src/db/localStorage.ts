import type { Todo, TodoStatus } from '../types/todo';

const STORAGE_KEY = 'todo-pwa-data';

interface StorageData {
  todos: Todo[];
  lastId: number;
}

let storage: StorageData = {
  todos: [],
  lastId: 0
};

function loadFromStorage(): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      storage = JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
}

function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export async function initLocalStorage(): Promise<void> {
  loadFromStorage();
}

export async function addTodoLocal(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  loadFromStorage();
  
  const now = new Date().toISOString();
  const newTodo: Todo = {
    ...todo,
    id: ++storage.lastId,
    createdAt: now,
    updatedAt: now
  };
  
  storage.todos.push(newTodo);
  saveToStorage();
  
  return newTodo.id!;
}

export async function updateTodoLocal(id: number, updates: Partial<Todo>): Promise<void> {
  loadFromStorage();
  
  const todoIndex = storage.todos.findIndex(t => t.id === id);
  if (todoIndex >= 0) {
    storage.todos[todoIndex] = {
      ...storage.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveToStorage();
  }
}

export async function deleteTodoLocal(id: number): Promise<void> {
  loadFromStorage();
  
  storage.todos = storage.todos.filter(t => t.id !== id);
  saveToStorage();
}

export async function listTodosLocal(filters?: {
  status?: TodoStatus | 'all';
  tag?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}): Promise<Todo[]> {
  loadFromStorage();
  
  let result = [...storage.todos];
  
  // Filter by status
  if (filters?.status && filters.status !== 'all') {
    result = result.filter(todo => todo.status === filters.status);
  }
  
  // Filter by tag
  if (filters?.tag) {
    result = result.filter(todo => 
      todo.tags?.toLowerCase().includes(filters.tag!.toLowerCase())
    );
  }
  
  // Sort
  if (filters?.sortBy) {
    result.sort((a, b) => {
      let aVal: string | undefined;
      let bVal: string | undefined;
      
      switch (filters.sortBy) {
        case 'dueDate':
          aVal = a.dueDate;
          bVal = b.dueDate;
          break;
        case 'createdAt':
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        case 'title':
          aVal = a.title;
          bVal = b.title;
          break;
      }
      
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      
      const comparison = aVal.localeCompare(bVal);
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }
  
  return result;
}

export async function exportDatabaseLocal(): Promise<string> {
  loadFromStorage();
  return JSON.stringify({ todos: storage.todos, version: 1 }, null, 2);
}

export async function importDatabaseLocal(jsonData: string, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  const data = JSON.parse(jsonData);
  
  loadFromStorage();
  
  if (mode === 'replace') {
    storage.todos = [];
    storage.lastId = 0;
  }
  
  for (const todo of data.todos) {
    const newId = ++storage.lastId;
    storage.todos.push({
      ...todo,
      id: newId
    });
  }
  
  saveToStorage();
}