import { ServerResponse, IncomingMessage } from 'http';

import * as users from "./users";

import { STATUS_CODE, ERRORS, CONTENT_TYPE } from "./duck/constants";
import { getContent, isValidId, isValidData } from './duck/helpers';



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
    } else {
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
      const user = users.add(content);
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

export const updateUser = async (req: IncomingMessage, res: ServerResponse, id: string) => { 
  try {
    if(!isValidId(id)){
      res.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
      res.end(
        JSON.stringify({
          code: STATUS_CODE.BAD_REQUEST,
          message: ERRORS.INVALID_ID,
        })
      );
    } else {
      const user = users.getById(id);
      if (user.length) {
        const content = await getContent(req, res);
        if (isValidData(res, content)) {
          const user = users.update(id,content);
          res.writeHead(STATUS_CODE.OK, CONTENT_TYPE);
          res.end(JSON.stringify(user));
        }
       
      } else {
        res.writeHead(STATUS_CODE.NOT_FOUND, CONTENT_TYPE);
        res.end(
          JSON.stringify({
            code: STATUS_CODE.NOT_FOUND,
            message: ERRORS.NOT_FOUND_USER,
          })
        );
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
  }
}

export const deleteUser = (res: ServerResponse, id: string) => {
  if(!isValidId(id)){
    res.writeHead(STATUS_CODE.BAD_REQUEST, CONTENT_TYPE);
    res.end(
      JSON.stringify({
        code: STATUS_CODE.BAD_REQUEST,
        message: ERRORS.INVALID_ID,
      })
    );
  } else {
    const user = users.getById(id);
      if (user.length) {
        const user = users.remove(id);
        res.writeHead(STATUS_CODE.DELETED, CONTENT_TYPE);
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
  }
}

