import { useState } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { AppMenu } from './components/AppMenu';
import { AddTaskDialog } from './components/AddTaskDialog';
import './App.css';

function App() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <TodoProvider>
      <div className="app">
        <header className="app-header">
          <h1>Offline Todo PWA</h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Task
            </button>
            <AppMenu />
          </div>
        </header>

        <main className="app-main">
          <FilterBar />
          <TodoList />
        </main>

        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </TodoProvider>
  );
}

export default App;