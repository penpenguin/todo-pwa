import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Todo, TodoStatus } from '../types/todo';
import { useTodos } from '../contexts/TodoContext';
import { format } from 'date-fns';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTodo?: Todo;
}

export function AddTaskDialog({ open, onOpenChange, editTodo }: AddTaskDialogProps) {
  const { addNewTodo, updateExistingTodo } = useTodos();
  const [title, setTitle] = useState(editTodo?.title || '');
  const [description, setDescription] = useState(editTodo?.description || '');
  const [dueDate, setDueDate] = useState(editTodo?.dueDate || '');
  const [status, setStatus] = useState<TodoStatus>(editTodo?.status || '未着手');
  const [tags, setTags] = useState(editTodo?.tags || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (editTodo?.id) {
        await updateExistingTodo(editTodo.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate: dueDate || undefined,
          status,
          tags: tags.trim() || undefined
        });
      } else {
        await addNewTodo({
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate: dueDate || undefined,
          status,
          tags: tags.trim() || undefined
        });
      }
      
      onOpenChange(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todo');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('未着手');
    setTags('');
    setError('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">
            {editTodo ? 'Edit Task' : 'Add New Task'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="task-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TodoStatus)}
              >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. work, personal, urgent"
              />
            </div>

            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" className="btn btn-primary">
                {editTodo ? 'Update' : 'Add'} Task
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}