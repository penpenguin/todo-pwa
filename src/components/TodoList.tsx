import { useState } from 'react';
import { useTodos } from '../contexts/useTodos';
import { TodoItem } from './TodoItem';
import { AddTaskDialog } from './AddTaskDialog';
import type { Todo } from '../types/todo';

export function TodoList() {
  const { todos, loading, error } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTodo(undefined);
    }
    setIsDialogOpen(open);
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (todos.length === 0) {
    return (
      <>
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Click the "Add Task" button to create your first task</p>
        </div>
        <AddTaskDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          editTodo={editingTodo}
        />
      </>
    );
  }

  return (
    <>
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onEdit={handleEdit} />
        ))}
      </div>
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        editTodo={editingTodo}
      />
    </>
  );
}