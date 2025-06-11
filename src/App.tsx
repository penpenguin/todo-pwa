import { useState } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { ExportImport } from './components/ExportImport';
import { AddTaskDialog } from './components/AddTaskDialog';
import './App.css';

function App() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <TodoProvider>
      <div className="app">
        <header className="app-header">
          <h1>Offline Todo PWA</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add Task
          </button>
        </header>

        <main className="app-main">
          <FilterBar />
          <TodoList />
        </main>

        <footer className="app-footer">
          <ExportImport />
        </footer>

        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </TodoProvider>
  );
}

export default App;