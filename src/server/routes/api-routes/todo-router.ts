import { Router } from 'express';
import bodyParser from 'body-parser';

export function todoRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/', function getTodoIndex() {});

  router.post('/', function createTodo() {});

  router.get('/:id', function getTodoById() {});

  router.put('/:id', function updateTodoById() {});

  router.put('/:id/fulfilled/toggle', function toggleFulfilledTodoById() {});

  return router;
}
