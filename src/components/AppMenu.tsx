import { useRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { exportDatabase, importDatabase } from '../db/database';
import { useTodos } from '../contexts/useTodos';

export function AppMenu() {
  const { refreshTodos } = useTodos();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await exportDatabase();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export data');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const mode = confirm('Replace all existing tasks? (Cancel to merge)') ? 'replace' : 'merge';
      await importDatabase(text, mode);
      await refreshTodos();
      alert('Import successful!');
    } catch {
      alert('Failed to import data. Please check the file format.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="btn btn-secondary menu-trigger" aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2C8.89543 2 8 2.89543 8 4C8 5.10457 8.89543 6 10 6Z" fill="currentColor"/>
              <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" fill="currentColor"/>
              <path d="M10 18C11.1046 18 12 17.1046 12 16C12 14.8954 11.1046 14 10 14C8.89543 14 8 14.8954 8 16C8 17.1046 8.89543 18 10 18Z" fill="currentColor"/>
            </svg>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
            <DropdownMenu.Item className="dropdown-item" onSelect={handleExport}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
                <path d="M8 10L4 6H7V2H9V6H12L8 10Z" fill="currentColor"/>
                <path d="M14 12V14H2V12H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V12H14Z" fill="currentColor"/>
              </svg>
              Export Data
            </DropdownMenu.Item>
            
            <DropdownMenu.Item className="dropdown-item" onSelect={() => fileInputRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
                <path d="M8 6L12 10H9V14H7V10H4L8 6Z" fill="currentColor"/>
                <path d="M14 4V2H2V4H0V2C0 0.9 0.9 0 2 0H14C15.1 0 16 0.9 16 2V4H14Z" fill="currentColor"/>
              </svg>
              Import Data
            </DropdownMenu.Item>

            <DropdownMenu.Arrow className="dropdown-arrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </>
  );
}