import config from 'config';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const allowedOrigins: Array<string> = config.get('allowedOrigins');
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 20,
});

const corsOptions: CorsOptions = {
	origin: (origin: any, callback: any) => {
		if (!origin || typeof origin !== 'string') return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error('Origin blocked by CORS'), false);
	},
	credentials: false,
};

function setAppMiddleware(app: Application): void {
	app
		.use(express.json())
		.use(morgan('dev'))
		.use(cors(corsOptions))
		.use(limiter)
		.use(helmet())
		.disable('x-powered-by'); // for some reason this doesn't work in helmet
}

export { setAppMiddleware };
