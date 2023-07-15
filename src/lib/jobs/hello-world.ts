import { client } from '$lib/inngest';

export type HelloWorldEvent = {
	name: 'test/hello.world';
	data: object;
};

export const helloWorld = client.createFunction(
	{
		name: 'hello-world',
	},
	{
		event: 'test/hello.world'
	},
	async ({ event, step, logger }) => {
		await step.sleep('60s');
		logger.info('Running: Hello World!');
		return {
			event,
			body: 'Hello World!'
		};
	}
);
