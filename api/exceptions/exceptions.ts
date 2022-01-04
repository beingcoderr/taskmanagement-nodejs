export function BadRequestException(message?: string) {
  const error = new CustomError();
  error.status = 400;
  error.message = message || "Bad request exception";
  throw error;
}

export function UnauthorizedException(message?: string) {
  const error = new CustomError();
  error.status = 401;
  error.message = message || "Unauthorized";
  throw error;
}

export function NotFoundException(message?: string) {
  const error = new CustomError();
  error.status = 404;
  error.message = message || "Not Found";
  throw error;
}

export function ConflictException(message?: string) {
  const error = new CustomError();
  error.status = 409;
  error.message = message || "Conflict Exception";
  throw error;
}

export function InternalServerException(message?: string) {
  const error = new CustomError();
  error.status = 500;
  error.message = message || "Internal server error";
  throw error;
}

class CustomError {
  status: number;
  message: string;
}
