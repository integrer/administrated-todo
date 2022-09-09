#!/usr/bin/env node

const tsConfig = require('../src/server/tsconfig.json');
require('ts-node').register(tsConfig);
const { tableSeeder, transaction } = require('../src/server/db');
const { PGUsersService } = require('../src/server/services/users-service');

const seedData = [
  [
    'todos',
    {
      names: ['username', 'email', 'body', 'fulfilled'],
      rows: [
        ['John Doe', 'j.doe@contoso.com', 'Build awesome app', true],
        ['Petter Simons', 'p.simons@example.com', 'Implement awesome feature', false],
      ],
    },
  ],
];

const usersData = [{ login: 'admin', password: '123', isAdmin: true }];

transaction(async (client) => {
  try {
    const seedTable = tableSeeder(client);
    const usersSvc = new PGUsersService(client);
    await usersSvc.createUsersUnsafe(usersData);
    await seedData.reduce((prevPromise, tableData) => prevPromise.then(() => seedTable(...tableData)), Promise.resolve());
  } catch (e) {
    console.error(e);
    throw e;
  }
});
