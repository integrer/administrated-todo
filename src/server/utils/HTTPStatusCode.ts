export enum HTTPStatusCode {
  OK = 200,
  Created = 201,
  Accepted = 202,
  MovedPermanently = 301,
  Found = 302,
  MovedTemporary = 302,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
}
