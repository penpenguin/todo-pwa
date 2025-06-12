import * as Checkbox from '@radix-ui/react-checkbox';
import type { Todo } from '../types/todo';
import { useTodos } from '../contexts/useTodos';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { updateExistingTodo, deleteTodoItem } = useTodos();

  const handleStatusToggle = async () => {
    const newStatus = todo.status === '完了' ? '未着手' : '完了';
    await updateExistingTodo(todo.id!, { status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTodoItem(todo.id!);
    }
  };

  const getDueDateClass = () => {
    if (!todo.dueDate) return '';
    const date = parseISO(todo.dueDate);
    if (isPast(date) && todo.status !== '完了') return 'overdue';
    if (isToday(date)) return 'due-today';
    if (isTomorrow(date)) return 'due-tomorrow';
    return '';
  };

  const formatDueDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date) && todo.status !== '完了') return `Overdue: ${format(date, 'MMM d')}`;
    return format(date, 'MMM d, yyyy');
  };

  const tags = todo.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

  return (
    <div className={`todo-item ${todo.status === '完了' ? 'completed' : ''}`}>
      <Checkbox.Root
        className="checkbox"
        checked={todo.status === '完了'}
        onCheckedChange={handleStatusToggle}
      >
        <Checkbox.Indicator className="checkbox-indicator">
          ✓
        </Checkbox.Indicator>
      </Checkbox.Root>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        <div className="todo-meta">
          {todo.dueDate && (
            <span className={`due-date ${getDueDateClass()}`}>
              📅 {formatDueDate(todo.dueDate)}
            </span>
          )}
          
          <span className={`status-badge status-${todo.status}`}>
            {todo.status}
          </span>
          
          {tags.length > 0 && (
            <div className="tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="btn-icon"
          onClick={() => onEdit(todo)}
          title="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn-icon"
          onClick={handleDelete}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}