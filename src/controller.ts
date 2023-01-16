import { ServerResponse, IncomingMessage } from 'http';

import * as users from "./users.js";

import { STATUS_CODE, ERRORS, CONTENT_TYPE } from "./duck/constants.js";
import { getContent, isValidId, isValidData } from './duck/helpers.js';



export const getAllUsers = (res: ServerResponse) => {
  try {
    res.writeHead(STATUS_CODE.OK, CONTENT_TYPE);
    res.end(JSON.stringify(users.getAll()));
  } catch {
    res.writeHead(STATUS_CODE.SERVER_ERROR, CONTENT_TYPE);
    res.end(
      JSON.stringify({
        code: STATUS_CODE.SERVER_ERROR,
        message: ERRORS.SERVER_ERROR,
      })
    );
  }
};

export const getUser = (res: ServerResponse, id: string) => {
  try {
    if(!isValidId(id)){
      res.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
      res.end(
        JSON.stringify({
          code: STATUS_CODE.BAD_REQUEST,
          message: ERRORS.INVALID_ID,
        })
      );
    }

    const user = users.getById(id);

    if (user.length) {
      res.writeHead(STATUS_CODE.OK, CONTENT_TYPE);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(STATUS_CODE.NOT_FOUND, CONTENT_TYPE);
      res.end(
        JSON.stringify({
          code: STATUS_CODE.NOT_FOUND,
          message: ERRORS.NOT_FOUND_USER,
        })
      );
    }
  } catch {
    res.writeHead(STATUS_CODE.SERVER_ERROR, CONTENT_TYPE);
    res.end(
      JSON.stringify({
        code: STATUS_CODE.SERVER_ERROR,
        message: ERRORS.SERVER_ERROR,
      })
    );
  }
};

export  const createUser = async (req: IncomingMessage, res: ServerResponse) => {

  try {
    const content = await getContent(req, res);
    if (isValidData(res, content)) {
      const user = users.addUser(content);
      res.writeHead(STATUS_CODE.CREATED, CONTENT_TYPE);
      res.end(JSON.stringify(user));
    }
  } catch {
    res.writeHead(STATUS_CODE.SERVER_ERROR, CONTENT_TYPE);
    res.end(
      JSON.stringify({
        code: STATUS_CODE.SERVER_ERROR,
        message: ERRORS.SERVER_ERROR,
      })
    );
  }
}
