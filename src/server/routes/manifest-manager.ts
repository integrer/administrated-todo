import fs from 'fs';
import path from 'path';
import { IS_DEV, WEBPACK_PORT } from '../config';
import { once } from 'ramda';

export const getManifest: () => Promise<Record<string, string>> = (() => {
  if (!IS_DEV) {
    const manifestPath = path.join(process.cwd(), 'dist', 'statics', 'manifest.json');
    return once(() => fs.promises.readFile(manifestPath, 'utf-8').then((f) => JSON.parse(f)));
  }
  const manifestPath = `http://localhost:${WEBPACK_PORT}/statics/manifest.json`;
  return () => fetch(manifestPath).then((res) => res.json());
})();
