/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    login: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    is_admin: { type: 'boolean', notNull: true, default: false },
  });

  pgm.createTable('sessions', {
    id: { type: 'char(32)', primaryKey: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    eat: { type: 'timestamp', notNull: true },
  });
  pgm.createIndex('sessions', 'user_id');

  pgm.createTable('todos', {
    id: 'id',
    username: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    body: { type: 'text', notNull: false },
    fulfilled: { type: 'boolean', notNull: true, default: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('todos');
  pgm.dropTable('sessions');
  pgm.dropTable('users');
};
