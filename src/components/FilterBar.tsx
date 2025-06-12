import * as Select from '@radix-ui/react-select';
import { useTodos } from '../contexts/useTodos';
import type { TodoStatus } from '../types/todo';

export function FilterBar() {
  const { filters, setFilters } = useTodos();

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as TodoStatus | 'all' | 'active' });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [string, string];
    setFilters({ ...filters, sortBy: sortBy as 'dueDate' | 'createdAt' | 'title', sortOrder: sortOrder as 'asc' | 'desc' });
  };

  const handleTagFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, tag: e.target.value });
  };

  return (
    <div className="filter-bar">
      <Select.Root value={filters.status || 'active'} onValueChange={handleStatusChange}>
        <Select.Trigger className="select-trigger">
          <Select.Value />
          <Select.Icon className="select-icon">▼</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="select-content">
            <Select.Viewport>
              <Select.Item value="active" className="select-item">
                <Select.ItemText>Active Tasks</Select.ItemText>
              </Select.Item>
              <Select.Item value="all" className="select-item">
                <Select.ItemText>All Tasks</Select.ItemText>
              </Select.Item>
              <Select.Item value="未着手" className="select-item">
                <Select.ItemText>未着手</Select.ItemText>
              </Select.Item>
              <Select.Item value="進行中" className="select-item">
                <Select.ItemText>進行中</Select.ItemText>
              </Select.Item>
              <Select.Item value="完了" className="select-item">
                <Select.ItemText>完了</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Select.Root 
        value={`${filters.sortBy}-${filters.sortOrder}`} 
        onValueChange={handleSortChange}
      >
        <Select.Trigger className="select-trigger">
          <Select.Value />
          <Select.Icon className="select-icon">▼</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="select-content">
            <Select.Viewport>
              <Select.Item value="dueDate-asc" className="select-item">
                <Select.ItemText>Due Date ↑</Select.ItemText>
              </Select.Item>
              <Select.Item value="dueDate-desc" className="select-item">
                <Select.ItemText>Due Date ↓</Select.ItemText>
              </Select.Item>
              <Select.Item value="createdAt-asc" className="select-item">
                <Select.ItemText>Created ↑</Select.ItemText>
              </Select.Item>
              <Select.Item value="createdAt-desc" className="select-item">
                <Select.ItemText>Created ↓</Select.ItemText>
              </Select.Item>
              <Select.Item value="title-asc" className="select-item">
                <Select.ItemText>Title A-Z</Select.ItemText>
              </Select.Item>
              <Select.Item value="title-desc" className="select-item">
                <Select.ItemText>Title Z-A</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <input
        type="text"
        placeholder="Filter by tag..."
        value={filters.tag || ''}
        onChange={handleTagFilter}
        className="tag-filter"
      />
    </div>
  );
}