import { describe, it, expect } from 'vitest';
import type { Todo, TodoStatus, FilterOptions } from '../types/todo';

describe('Types', () => {
  it('should define TodoStatus correctly', () => {
    const statuses: TodoStatus[] = ['未着手', '進行中', '完了'];
    expect(statuses).toHaveLength(3);
  });

  it('should create a Todo object with required fields', () => {
    const todo: Todo = {
      title: 'Test Todo',
      status: '未着手'
    };
    
    expect(todo.title).toBe('Test Todo');
    expect(todo.status).toBe('未着手');
  });

  it('should create a Todo object with all fields', () => {
    const todo: Todo = {
      id: 1,
      title: 'Complete Todo',
      description: 'A complete todo item',
      dueDate: '2024-12-31',
      status: '進行中',
      tags: 'work,important',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    
    expect(todo.id).toBe(1);
    expect(todo.description).toBe('A complete todo item');
    expect(todo.dueDate).toBe('2024-12-31');
    expect(todo.tags).toBe('work,important');
  });

  it('should create FilterOptions with default values', () => {
    const filters: FilterOptions = {
      status: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    };
    
    expect(filters.status).toBe('all');
    expect(filters.sortBy).toBe('dueDate');
    expect(filters.sortOrder).toBe('asc');
  });
});