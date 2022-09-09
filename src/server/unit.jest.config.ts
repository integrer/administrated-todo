import { Config } from 'jest';
import { baseConfig } from '../shared/jest-base-config';

const config: Config = {
  ...baseConfig,
  testEnvironment: 'node',
  preset: 'ts-jest',
};

// noinspection JSUnusedGlobalSymbols
export default config;
