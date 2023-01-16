import * as http from "http";
import cluster from 'cluster';
import * as dotenv from 'dotenv';

import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "./controller";

import { parseUrl } from "./duck/helpers";
import { STATUS_CODE, ERRORS, CONTENT_TYPE } from "./duck/constants";

dotenv.config();


const PORT = process.env.PORT || 4000;
const MODE = process.env.MODE;


export const server =  http.createServer((req ,res)=> {

  const {api, endpoint, id} = parseUrl(req);

  if(endpoint === "users" && api === "api") {
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
      case "DELETE":{
        deleteUser(res, id);
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
  } else {
    res.writeHead(STATUS_CODE.NOT_FOUND, CONTENT_TYPE);
    res.end(
      JSON.stringify({
        code: STATUS_CODE.NOT_FOUND,
        message: ERRORS.NOT_FOUND_ENDPOINT,
      })
    );
  }
});



export const multiServer = (port: string | number): void => {
  const COUNT_WORKERS = 4;
  const pid = process.pid;

  if (cluster.isPrimary) {

    console.log(`Master pid: ${pid}`);
    console.log(`Count forks: ${COUNT_WORKERS}`);
    for (let i = 0; i < COUNT_WORKERS; i++) cluster.fork();
  } else {
    const id = cluster.worker?.id || 0;
    const currentPort = Number(port) + id - 1;
    console.log(`Worker id: ${id} pid: ${pid} port: ${currentPort}`);

    server.listen(currentPort, ()=>{
      console.log(`Server start on ${currentPort} PORT`
      )
  });
 }
};


if(MODE !== "multi") {
  server.listen(PORT, ()=>{
    console.log(`Server start on ${PORT} PORT`
    )
})
} else {
  multiServer(PORT);
}