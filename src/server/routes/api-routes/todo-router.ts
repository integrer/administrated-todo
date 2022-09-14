import { Router } from 'express';
import bodyParser from 'body-parser';
import { isNaN } from '@app/shared/utils/number';
import { PGTodoDAO } from '@app/server/dao/todos';
import { transaction } from '@app/server/db';
import { HTTPStatusCode } from '@app/shared/utils/rest';
import { permissionMiddleware } from '@app/server/services/users-service';
import { todoCreateFormSchema, todoUpdateFormSchema, parseTodoListParams } from '@app/shared/features/todos';
import { ValidationError } from 'yup';
import sanitize from 'sanitize-html';

const requiresAdminPermission = permissionMiddleware((acc) => acc.isAdmin);

const sanitizeTodo = <T extends { body: string }>(todo: T): T => ({ ...todo, body: sanitize(todo.body) });

export function todoRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/', async function getTodoIndex(req, res) {
    try {
      const params = parseTodoListParams(req.query);
      const data = await transaction((client) => new PGTodoDAO(client).getIndex(params));
      res.status(HTTPStatusCode.OK).json(data);
    } catch (e) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.post('/', async function createTodo(req, res) {
    try {
      const validated = await todoCreateFormSchema.validate(req.body);
      const sanitized = sanitizeTodo(validated);
      const newId = await transaction((client) => new PGTodoDAO(client).create(sanitized));
      res.status(HTTPStatusCode.Created).json(newId);
    } catch (e) {
      if (ValidationError.isError(e)) {
        return res.status(HTTPStatusCode.UnprocessableEntity).json({ errors: e.errors });
      }
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.get('/:id', async function getTodoById(req, res) {
    try {
      const id = +req.params.id;
      if (isNaN(id)) return res.sendStatus(HTTPStatusCode.NotFound);
      const data = await transaction((client) => new PGTodoDAO(client).getById(id));
      if (!data) return res.sendStatus(HTTPStatusCode.NotFound);
      res.status(HTTPStatusCode.OK).json(data);
    } catch (e) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.put('/:id', requiresAdminPermission, async function updateTodoById(req, res) {
    try {
      const id = +req.params.id;
      if (isNaN(id)) return res.sendStatus(HTTPStatusCode.NotFound);
      const validated = await todoUpdateFormSchema.validate(req.body);
      const sanitized = sanitizeTodo(validated);
      const found = await transaction((client) => new PGTodoDAO(client).updateById(id, sanitized));
      res.sendStatus(found ? HTTPStatusCode.OK : HTTPStatusCode.NotFound);
    } catch (e) {
      if (ValidationError.isError(e)) {
        return res.status(HTTPStatusCode.UnprocessableEntity).json({ errors: e.errors });
      }
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.delete('/:id', requiresAdminPermission, async function deleteTodoById(req, res) {
    try {
      const id = +req.params.id;
      if (!isNaN(id)) await transaction((client) => new PGTodoDAO(client).deleteById(id));
      res.sendStatus(HTTPStatusCode.OK);
    } catch (e) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.put('/:id/fulfilled/toggle', requiresAdminPermission, async function toggleFulfilledTodoById(req, res) {
    try {
      const id = +req.params.id;
      const found = !isNaN(id) && (await transaction((client) => new PGTodoDAO(client).toggleFulfilledById(id)));
      res.sendStatus(found ? HTTPStatusCode.OK : HTTPStatusCode.NotFound);
    } catch (e) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  return router;
}
