import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Todo, FilterOptions, TodoStatus } from '../types/todo';
import { initDatabase, listTodos, addTodo, updateTodo, deleteTodo } from '../db/database';

interface TodoContextType {
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

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedFilters = localStorage.getItem('todo-filters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
    
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('todo-filters', JSON.stringify(filters));
    refreshTodos();
  }, [filters]);

  const initApp = async () => {
    try {
      setLoading(true);
      await initDatabase();
      await refreshTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    try {
      const todoList = await listTodos({
        status: filters.status as TodoStatus | 'all',
        tag: filters.tag,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      setTodos(todoList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    }
  };

  const addNewTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTodo(todo);
      await refreshTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
      throw err;
    }
  };

  const updateExistingTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      await updateTodo(id, updates);
      await refreshTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodoItem = async (id: number) => {
    try {
      await deleteTodo(id);
      await refreshTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filters,
        loading,
        error,
        addNewTodo,
        updateExistingTodo,
        deleteTodoItem,
        setFilters,
        refreshTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}