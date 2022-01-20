/**
 * Throw a bad request exception.
 *
 * Status code - 400
 */
export function BadRequestException(message?: string) {
  const error = new CustomError();
  error.status = 400;
  error.message = message || "Bad request exception";
  throw error;
}

/**
 * Throw a unauthorized exception.
 *
 * Status code - 401
 */
export function UnauthorizedException(message?: string) {
  const error = new CustomError();
  error.status = 401;
  error.message = message || "Unauthorized";
  throw error;
}

/**
 * Throw a not found exception.
 *
 * Status code - 404
 */
export function NotFoundException(message?: string) {
  const error = new CustomError();
  error.status = 404;
  error.message = message || "Not Found";
  throw error;
}

/**
 * Throw a conflict exception.
 *
 * Status code - 409
 */
export function ConflictException(message?: string) {
  const error = new CustomError();
  error.status = 409;
  error.message = message || "Conflict Exception";
  throw error;
}

/**
 * Throw a internal server exception.
 *
 * Status code - 500
 */
export function InternalServerException(message?: string) {
  const error = new CustomError();
  error.status = 500;
  error.message = message || "Internal server error";
  throw error;
}

/**
 * Throw a forbidden exception.
 *
 * Status code - 403
 */
export function ForbiddenException(message?: string) {
  const error = new CustomError();
  error.status = 403;
  error.message = message || "Forbidden resource";
  throw error;
}

export class CustomError extends Error {
  status: number;
  message: string;
}
