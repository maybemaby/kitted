import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(80)
});

export const RegisterSchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.max(80)
			// regex for at least one special character and one number in any order
			.regex(
				/^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[0-9]).*$/,
				'Password must contain at least one special character (!@#$%^&*) and one number'
			),
		passwordConfirm: z.string().min(8).max(80),
		firstName: z.string().min(1).max(80),
		lastName: z.string().min(1).max(80)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		path: ['passwordConfirm'],
		message: 'Passwords do not match'
	});
