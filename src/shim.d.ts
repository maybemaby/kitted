import 'vitest';
interface CustomMatchers<R = unknown> {
	toBeInTheDocument(): R;
	toHaveTextContent(expected: string | RegExp): R;
	toHaveValue(expected: string | string[] | number): R;
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
}
