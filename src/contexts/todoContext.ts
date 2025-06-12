import { createContext } from 'react';
import type { TodoContextType } from './TodoContextTypes';

export const TodoContext = createContext<TodoContextType | undefined>(undefined);