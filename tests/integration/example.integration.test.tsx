import { useState } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Component to test
const TodoList = () => {
	const [todos, setTodos] = useState<string[]>([]);
	const [newTodo, setNewTodo] = useState('');

	const addTodo = () => {
		if (newTodo.trim()) {
			setTodos([...todos, newTodo.trim()]);
			setNewTodo('');
		}
	};

	return (
		<div>
			<input
				type="text"
				value={newTodo}
				onChange={e => setNewTodo(e.target.value)}
				placeholder="Add a new todo"
				data-testid="todo-input"
			/>
			<button onClick={addTodo} data-testid="add-todo">
				Add Todo
			</button>
			<ul>
				{todos.map((todo, index) => (
					<li key={index} data-testid={`todo-item-${index}`}>
						{todo}
					</li>
				))}
			</ul>
		</div>
	);
};

describe('TodoList Integration', () => {
	// Integration tests setup
	beforeAll(() => {
		// Here you would initialize MSW or other services
	});

	afterAll(() => {
		// Cleanup after all tests
	});

	afterEach(() => {
		// Cleanup after each test
	});

	it('should add and display multiple todos', async () => {
		const user = userEvent.setup();
		render(<TodoList />);

		// First todo
		const input = screen.getByTestId('todo-input');
		const addButton = screen.getByTestId('add-todo');

		await act(async () => {
			await user.type(input, 'First todo');
			await user.click(addButton);
		});

		await waitFor(() => {
			expect(screen.getByTestId('todo-item-0')).toHaveTextContent('First todo');
			expect(input).toHaveValue('');
		});

		// Second todo
		await act(async () => {
			await user.type(input, 'Second todo');
			await user.click(addButton);
		});

		await waitFor(() => {
			expect(screen.getByTestId('todo-item-0')).toHaveTextContent('First todo');
			expect(screen.getByTestId('todo-item-1')).toHaveTextContent('Second todo');
			expect(input).toHaveValue('');
		});
	});

	it('should not add empty todos', async () => {
		const user = userEvent.setup();
		render(<TodoList />);

		const addButton = screen.getByTestId('add-todo');

		await act(async () => {
			await user.click(addButton);
		});

		await waitFor(() => {
			expect(screen.queryByTestId('todo-item-0')).not.toBeInTheDocument();
		});
	});
});
