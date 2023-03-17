/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const morgan = require("morgan");
// const PORT = 3000;
// Setup your Middleware and API Router here

const client = require("./db/client");
client.connect();
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

// server.get("*", req, res) => {
//     res.status(404).send({
//       name: "404 Not Found",
//       message: "No file found at the given route",
//     })
// };

server.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) {
    res.status(401);
    res.send({
      error: error.message,
      name: error.name,
      message: error.message,
    });
  } else {
    res.status(res.statusCode);
    res.send({
      error: error.message,
      name: error.name,
      message: error.message,
    });
  }
});

module.exports = server;
