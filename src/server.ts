import { App } from './app';
import { checkEnvironmentVariables } from './utils/environment-validator';
import { logger } from './utils/logger';

const app: App = new App();

if (checkEnvironmentVariables()) {
	startServer();
} else {
	logger.error(
		'Environment variables not set. Please set environment to "development" or "production"'
	);
}

async function startServer() {
	await app.init();
	app.listen();
}
