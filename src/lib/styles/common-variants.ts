import { cva, type VariantProps } from 'class-variance-authority';

export const boxVariants = cva('box', {
	variants: {
		rounded: {
			0: 'rounded-none',
			1: 'rounded-sm',
			2: 'rounded-md',
			3: 'rounded-lg',
			4: 'rounded-xl',
			full: 'rounded-full'
		},
		borderWidth: {
			0: 'border-0',
			1: 'border-1',
			2: 'border-2',
			3: 'border-3',
			4: 'border-4',
			5: 'border-5'
		},
		shadow: {
			0: 'shadow-0',
			1: 'shadow-1',
			2: 'shadow-2',
			3: 'shadow-3',
			4: 'shadow-4',
			5: 'shadow-5',
			6: 'shadow-6'
		}
	},
	defaultVariants: {
		rounded: 0,
		borderWidth: 0
	}
});

export type BoxProps = VariantProps<typeof boxVariants>;
