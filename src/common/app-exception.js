export class AppException extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class RouteNotFoundException extends AppException {
  constructor() {
    super(404, 'Route is not handled');
  }
}

export class PaginationParamException extends AppException {
  constructor() {
    super(400, 'Pagination parameters format is bad');
  }
}

export class ResourceNotFoundException extends AppException {
  constructor() {
    super(404, 'Resource with given id does not exist');
  }
}

export class ResourceFormatException extends AppException {
  constructor() {
    super(400, 'Resource format is bad');
  }
}

export class ResourceIdFormatException extends AppException {
  constructor() {
    super(400, 'Resource id format is bad');
  }
}

export class RoleNotAllowedException extends AppException {
  constructor() {
    super(403, 'Role is not allowed');
  }
}

export class BadAuthenticationTokenException extends AppException {
  constructor() {
    super(401, 'Authentication token is bad');
  }
}

export class MissingAuthenticationTokenException extends AppException {
  constructor() {
    super(401, 'Authentication token is missing');
  }
}

export class MissingCredentialsException extends AppException {
  constructor() {
    super(401, 'Credentials are missing');
  }
}

export class AuthenticationFailException extends AppException {
  constructor() {
    super(401, 'Authentication failed');
  }
}

export class UnexpectedException extends AppException {
  constructor() {
    super(500, 'An unexpected error has occurred');
  }
}
