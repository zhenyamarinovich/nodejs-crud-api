import * as http from "http";

import { getAllUsers, getUser, createUser, updateUser } from "./controller.js";

import { parseUrl } from "./duck/helpers.js";
import { STATUS_CODE, ERRORS, CONTENT_TYPE } from "./duck/constants.js";


const PORT = process.env.PORT || 4000;


const server = http.createServer((req ,res)=> {

  const {endpoint, id} = parseUrl(req);

  if(endpoint === "users") {
    switch (req.method) {
      case "GET": {
          if(id) {
            getUser(res, id)
          } else {
            getAllUsers(res);
          }
          break;
      }
      case "POST": {
        createUser(req, res);
        break;
      }
      case "PUT": {
        updateUser(req, res, id);
        break;
      }
      default: {
        res.writeHead(STATUS_CODE.NOT_FOUND, CONTENT_TYPE);
        res.end(
          JSON.stringify({
            code: STATUS_CODE.NOT_FOUND,
            message: ERRORS.NOT_FOUND_ENDPOINT,
          })
        );
      }
    }
  }

  
    });

server.listen(PORT, ()=>{
    console.log(`Server start on ${PORT} PORT`
    )
})