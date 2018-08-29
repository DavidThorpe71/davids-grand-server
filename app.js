import express from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import logger from 'morgan';
import http from "http";
import { ENV } from "./config/env";
import helmet from "helmet";
import compression from "compression";
import { ApolloServer } from 'apollo-server-express';
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schema";
import Raven from 'raven';
const debug = require('debug')('davids-grand-server:server');

var app = express();

Raven.config('https://80ed319bdbfe4f95b2d16780fb682cf3@sentry.io/1271316').install();
// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

app.get('/', function mainHandler(req, res) {
  throw new Error('Broke!');
});

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || '4000');



app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (ENV === "production") {
  app.use(compression());
  app.use(helmet());
} else {
  app.use(logger("dev"));
}

const server = http.createServer(app);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// connect();

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

console.info("Server running on port " + port + " in " + ENV + " mode!");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return { req, res }
  }
});

apolloServer.applyMiddleware({ app });

export default app;
