import { Config } from 'jest';
import { resolve } from 'path';

export const baseConfig: Config = {
  collectCoverageFrom: ['**/*.{j,t}s{,x}', '!**/*.d.ts'],
  rootDir: resolve(__dirname, '..'),
  moduleNameMapper: { '^@app/(.*)$': '<rootDir>/$1' },
};
