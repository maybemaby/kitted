import { Worker, Queue, type Processor } from 'bullmq';

type QueueArgs = ConstructorParameters<typeof Queue>;
type QueueArgsNoName = [QueueArgs[1], QueueArgs[2]];
type WorkerArgs = ConstructorParameters<typeof Worker>;
type WorkerArgsNoName<DataType = any, ResultType = any, NameType extends string = string> = [
	Processor<DataType, ResultType, NameType>,
	WorkerArgs[2]
];

/**
 * Creates a pair of functions to create a queue and a worker pair.
 *
 * @example
 * const [createTestQueue, createTestWorker] = WorkerQPair<{ message: string }>(
 *	'test',
 *	async (job) => {
 *		job.updateProgress(10);
 *
 *		return {
 *			success: true
 *		 };
 *	 }
 * );
 *
 *
 *
 *
 * @param name The name of the queue.
 * @param processor The function to process the job.
 * @param options Options for the queue and worker.
 * @returns Tuple where the first element is a function to create a queue and the second element is a function to create a worker.
 */
export function WorkerQPair<
	Data = any,
	Response = any,
	Name extends string = string,
	QueueName extends string = string
>(
	name: QueueName,
	processor: WorkerArgsNoName<Data, Response, Name>[0],
	options?: {
		queueArgs?: QueueArgsNoName;
		workerOpts?: WorkerArgsNoName<Data, Response, Name>[1];
	}
): [() => Queue<Data, Response, Name>, () => Worker<Data, Response, Name>] {
	const queueArgs = options?.queueArgs || [{}, undefined];

	return [
		() => {
			return new Queue<Data, Response, Name>(name, ...queueArgs);
		},
		() => {
			return new Worker<Data, Response, Name>(name, processor, options?.workerOpts);
		}
	];
}
