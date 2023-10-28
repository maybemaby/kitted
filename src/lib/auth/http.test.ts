import { describe, expect, it } from 'vitest';
import { createSignedCookieValue, getSignedCookieValue } from './http';

describe('cookie utils', () => {
	describe('signed cookies', () => {
		const valueKeyPairs = [
			['cookie-value', '0Rcug3tvn/mPIWvF/vGDFgzG9DkOvV4faw8FUhvrjz8='],
			['session-id123', 'sS8zgZ/fh9+iDK6kCDujCNX8HH4DtJTilhGxOBlUhQU=']
		];
		describe('createSignedCookieValue', () => {
			it.each(valueKeyPairs)('should create a signed cookie value', async (value, key) => {
				const cookie = await createSignedCookieValue(value, key);

				const [cookieValue, signature] = cookie.split('.');

				expect(cookieValue).toBe(value);
				expect(signature).not.toBe(key);
			});
		});

		describe('getSignedCookieValue', () => {
			it.each(valueKeyPairs)(
				'should read signed cookie value without throwing',
				async (value, key) => {
					const cookie = await createSignedCookieValue(value, key);

					const cookieValue = await getSignedCookieValue(cookie, key);

					expect(cookieValue).toBe(value);
				}
			);
		});

		it('should throw if signature is invalid', async () => {
			const cookie = await createSignedCookieValue('test', 'valid-key');

			await expect(getSignedCookieValue(cookie, 'invalid-key')).rejects.toThrow(
				'Invalid HMAC signature in cookie'
			);
		});
	});
});
