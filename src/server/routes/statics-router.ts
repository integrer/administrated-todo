import path from 'path';
import express from 'express';
import { IS_DEV, WEBPACK_PORT } from '../config';

export async function staticsRouter() {
  if (IS_DEV) {
    const { createProxyMiddleware } = await import('http-proxy-middleware');
    // All the assets are hosted by Webpack on localhost:${config.WEBPACK_PORT} (Webpack-dev-server)
    return createProxyMiddleware({ target: `http://localhost:${WEBPACK_PORT}/` });
  }
  const staticsPath = path.join(process.cwd(), 'dist', 'statics');

  // All the assets are in "statics" folder (Done by Webpack during the build phase)
  return express.static(staticsPath);
}
