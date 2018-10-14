import cookieParser from 'cookie-parser';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from './database/db';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';

dotenv.config();

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'nginxtest' },
  development: { ssl: false, port: 4000, hostname: 'localhost' }
};

const environment = process.env.NODE_ENV || 'production';
const config = configurations[environment];

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

const app = express();

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

app.use(cookieParser());
app.use((req, res, next) => {
  const REQUEST_ORIGIN = req.get('origin');
  console.log({ REQUEST_ORIGIN });
  next();
});

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

apollo.applyMiddleware({
  app,
  cors: { origin: 'http://localhost:7777', credentials: true }
});

const server = http.createServer(app);

// Add subscription support
apollo.installSubscriptionHandlers(server);

server.listen({ port: config.port }, () => console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  ));
