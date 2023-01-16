import * as http from "http";

import { getAllUsers, getUser, createUser } from "./controller.js";

import { parseUrl } from "./duck/helpers.js";
import { STATUS_CODE, ERRORS, CONTENT_TYPE } from "./duck/constants.js";


const PORT = process.env.PORT || 4000;


const server = http.createServer((req ,res)=> {

  const {endpoint, id} = parseUrl(req);

    switch (endpoint) {
        case "users": {
          if (req.method === "GET") {
            if(id) {
              getUser(res, id)
            } else {
              getAllUsers(res);
            }
          }
          if(req.method === "POST") {
            createUser(req, res);
          }
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
    });

server.listen(PORT, ()=>{
    console.log(`Server start on ${PORT} PORT`
    )
})