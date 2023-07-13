import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Button from './button.svelte';

test('button renders', () => {
	render(Button, {
		props: {
			kind: 'primary'
		}
	});

	expect(screen.getByRole('button')).toBeTruthy();
});
