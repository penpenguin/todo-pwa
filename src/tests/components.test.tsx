import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

function SimpleComponent() {
  return (
    <div>
      <h1>Todo PWA</h1>
      <p>Offline todo application</p>
    </div>
  );
}

describe('Component Tests', () => {
  it('renders simple component', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Todo PWA')).toBeDefined();
    expect(screen.getByText('Offline todo application')).toBeDefined();
  });
});