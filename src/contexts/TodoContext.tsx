import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Todo, FilterOptions, TodoStatus } from '../types/todo';
import { initDatabase, listTodos, addTodo, updateTodo, deleteTodo } from '../db/database';
import { TodoContext } from './todoContext';

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'active',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTodos = useCallback(async () => {
    try {
      const todoList = await listTodos({
        status: filters.status as TodoStatus | 'all' | 'active',
        tag: filters.tag,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      setTodos(todoList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    }
  }, [filters]);

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        await initDatabase();
        const savedFilters = localStorage.getItem('todo-filters');
        if (savedFilters) {
          setFilters(JSON.parse(savedFilters));
        }
        // Initial load of todos
        const todoList = await listTodos({
          status: savedFilters ? JSON.parse(savedFilters).status : 'active',
          tag: savedFilters ? JSON.parse(savedFilters).tag : undefined,
          sortBy: savedFilters ? JSON.parse(savedFilters).sortBy : 'dueDate',
          sortOrder: savedFilters ? JSON.parse(savedFilters).sortOrder : 'asc'
        });
        setTodos(todoList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };
    
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('todo-filters', JSON.stringify(filters));
    refreshTodos();
  }, [filters, refreshTodos]);

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