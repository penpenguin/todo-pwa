import { useRef } from 'react';
import { exportDatabase, importDatabase } from '../db/database';
import { useTodos } from '../contexts/useTodos';

export function ExportImport() {
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
    <div className="export-import">
      <button onClick={handleExport} className="btn btn-secondary">
        Export Data
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-secondary"
      >
        Import Data
      </button>
    </div>
  );
}