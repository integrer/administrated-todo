import express from 'express';
import path from 'path';
import moduleAlias from 'module-alias';
moduleAlias.addAlias('@app', path.resolve(__dirname, '..'));
import * as config from './config';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';

const delim = '*'.repeat(38);
console.log(delim);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(delim);

const app = express();
app.set('view engine', 'ejs');

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use('/api', apiRouter());
app.use(staticsRouter());
app.use(pagesRouter());

app.listen(config.SERVER_PORT, () => {
  console.log(`App listening on port ${config.SERVER_PORT}!`);
});
