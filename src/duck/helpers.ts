import { validate } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

import { IUser } from '../usersInterface.js';
import { CONTENT_TYPE, ERRORS, STATUS_CODE } from './constants.js';

export const isValidId = (id: string) => validate(id);

export const parseUrl = (req: IncomingMessage) => {
  if(!req.url) {
    return {}
  }

  const param = req.url.split("/").filter(Boolean);

  return {
    api: param[0],
    endpoint: param[1],
    id: param[2],
  };
};

export function getContent(request: IncomingMessage, response: ServerResponse): Promise<IUser> {
  return new Promise((resolve) => {
    let data = '';

    request.on('data', (chunk) => {
      data += chunk.toString();
    });

    request.on('end', () => {
      try {
        const content = JSON.parse(data);
        resolve(content);
      } catch {
        response.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
        response.end(JSON.stringify({ code: STATUS_CODE.BAD_REQUEST, message: ERRORS.INVALID_DATA }));
      }
    });
  });
}


export function isValidData(res: ServerResponse, user: IUser) {
    const { username, age, hobbies } = user;
    try {
      if (typeof username !== 'string' || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
        res.end(JSON.stringify({ code: STATUS_CODE.BAD_REQUEST, message: ERRORS.MISS_NESSESARY_DATA }));
        return false;
      }
      if (hobbies.length > 0) {
        if (!hobbies.every(elem => typeof elem === 'string')) {
            res.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
            res.end(JSON.stringify({ code: STATUS_CODE.BAD_REQUEST, message: ERRORS.MISS_NESSESARY_DATA }));
          return false;
        }
      }
    } catch {
        res.writeHead(STATUS_CODE.SERVER_ERROR, CONTENT_TYPE);
        res.end(
          JSON.stringify({
            code: STATUS_CODE.SERVER_ERROR,
            message: ERRORS.SERVER_ERROR,
          })
        );
      return false;
    }
    return true;
  }