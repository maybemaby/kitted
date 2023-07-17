import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import user from '@testing-library/user-event';
import Input from './input.svelte';

describe('Input', () => {
	let userInput: ReturnType<(typeof user)['setup']>;

	beforeEach(() => {
		userInput = user.setup();
	});

	it('should render an input', async () => {
		render(Input, {
			props: {
				type: 'text'
			}
		});

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();

		await user.type(input, 'Hello, World!');
		expect(input).toHaveValue('Hello, World!');
	});

	it('Should render password input', async () => {
		render(Input, {
			props: {
				type: 'password'
			}
		});
		const button = screen.getByRole('button');
		expect(button).toBeTruthy();
		// The hide button has a screen-reader label
		expect(button).toHaveTextContent('Show');
		// Label should change when clicked
		await user.click(button);
		expect(button).toHaveTextContent('Hide');
	});
});
