require("dotenv").config();
const express = require("express");
const server = express();
const cors = require('cors');
const morgan = require('morgan');
// const PORT = 3000;
// Setup your Middleware and API Router here

const client = require('./db/client');
client.connect();

server.use(cors())

server.use(morgan('dev'));
server.use(express.json())

const apiRouter = require('./api');
server.use('/api', apiRouter);

// server.listen(PORT, () => {
//     console.log('The server is up on port', `${PORT}`)
//   });

module.exports = server;
