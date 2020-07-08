import { App } from './app';

const app: App = new App();

(async () => {
  await app.init();
  app.listen();
})();
