#!/usr/bin/env node

const tsConfig = require('../src/server/tsconfig.json');
require('ts-node').register(tsConfig);
const { seedDb } = require('../src/server/db');

const seedData = {
  users: {
    names: ['login', 'password', 'is_admin'],
    rows: [['admin', '123', true]],
  },
};

seedDb(seedData).catch((err) => console.error(err));
