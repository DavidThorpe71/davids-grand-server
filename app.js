import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import logger from 'morgan';
import http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import { ApolloServer } from 'apollo-server-express';
import Raven from 'raven';
import mongoose from 'mongoose';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';
import { ENV } from './config/env';
import db from './database/db';

import User from './database/models/User';

const debug = require('debug')('davids-grand-server:server');

const app = express();

// Setup of Raven
Raven.config(
  'https://80ed319bdbfe4f95b2d16780fb682cf3@sentry.io/1271316'
).install();
// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

app.get('/', (req, res) => {
  throw new Error('Broke!');
});

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(`${res.sentry}\n`);
});

const port = process.env.PORT || '4444';

app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Put userId on each request by decoding the jwt and adding it to the request
app.use((req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// middleware to populate the user on each request
app.use(async (req, res, next) => {
  // If they aren't logged in skip this
  if (!req.userId) return next();
  // Get user from database by userID and add that user to req.user
  // const user = await db.query.user(
  //   { where: { id: req.userId } },
  //   '{id, permissions, email, name}'
  // );
  // req.user = user;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

if (ENV === 'production') {
  app.use(compression());
  app.use(helmet());
} else {
  app.use(logger('dev'));
}

const server = http.createServer(app);

// connect to Mongo database
const connect = () => {
  mongoose
    .connect(
      db,
      { useNewUrlParser: true }
    )
    .then(() => console.info(`Successfully connected to ${db}`))
    .catch((error) => {
      console.error('Error connecting to database: ', error);
      return process.exit(1);
    });
};
mongoose.set('useCreateIndex', true);
connect();
mongoose.connection.on('disconnected', connect);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.info(`Server running on port ${port} in ${ENV} mode!`);
console.info(`GraphQL playground: http://localhost:${port}/graphql`);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

apolloServer.applyMiddleware({ app });

export default app;
