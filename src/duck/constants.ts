export const enum STATUS_CODE {
    OK = 200,
    CREATED = 201,
    DELETED = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
  }
  
  export const enum ERRORS {
    NOT_FOUND_USER = "User with current id is not exist",
    NOT_FOUND_ENDPOINT = 'Endpoint does not exist',
    INVALID_ID = "Invalid user ID (not uuid)",
    unsupportedMethod = 'This is a request method the server does not support',
    SERVER_ERROR = 'Internal Server Error',
    ok = 'successfully',
    INVALID_DATA = 'Invalid data',
    MISS_NESSESARY_DATA = "Miss or wrong required fields",
    createdUser = 'A new record has been created',
  }

 export const CONTENT_TYPE = { "Content-Type": "application/json" };