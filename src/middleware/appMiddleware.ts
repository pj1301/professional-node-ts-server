import config from 'config';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

const allowedOrigins: Array<string> = config.get('allowedOrigins');

const corsOptions: CorsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || typeof origin !== 'string') return callback(null, true);
    if (!allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin blocked by CORS'), false)
  },
  credentials: false
}

function setAppMiddleware(app: Application): void {
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
}

export { setAppMiddleware };
