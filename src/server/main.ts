import express from 'express';
import path from 'path';
import moduleAlias from 'module-alias';
moduleAlias.addAlias('@app', path.resolve(__dirname, '..'));
import * as config from './config';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';

(async () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`config: ${JSON.stringify(config, null, 2)}`);

  if (!globalThis.fetch) require('cross-fetch/polyfill');
  const app = express();
  app.set('view engine', 'ejs');

  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/api', apiRouter());
  app.use('/statics', await staticsRouter());
  app.use(pagesRouter());

  app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });
})();
