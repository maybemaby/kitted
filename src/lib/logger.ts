import pino from 'pino';

let transport: pino.LoggerOptions['transport'];

if (process.env.NODE_ENV === 'development') {
	transport = {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'yyyy-mm-dd HH:MM:ss.l'
		}
	};
}

export const logger = pino({
	formatters: {
		log(object) {
			if (object instanceof Request) {
				const url = new URL(object.url);
				return {
					method: object.method,
					url: object.url,
					path: url.pathname,
					query: url.searchParams.toString(),
					agent: object.headers.get('user-agent')
				};
			}
			return object;
		}
	},
	transport
});
