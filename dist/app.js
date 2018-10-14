'use strict';

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require('apollo-server-express');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _db = require('./database/db');

var _db2 = _interopRequireDefault(_db);

var _resolvers = require('./graphql/resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _schema = require('./graphql/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'nginxtest' },
  development: { ssl: false, port: 4000, hostname: 'localhost' }
};

const environment = process.env.NODE_ENV || 'production';
const config = configurations[environment];

const apollo = new _apolloServerExpress.ApolloServer({
  typeDefs: _schema2.default,
  resolvers: _resolvers2.default,
  context: ({ req, res }) => ({ req, res })
});

const app = (0, _express2.default)();

const connect = () => {
  _mongoose2.default.connect(_db2.default, { useNewUrlParser: true }).then(() => console.info(`Successfully connected to ${_db2.default}`)).catch(error => {
    console.error('Error connecting to database: ', error);
    return process.exit(1);
  });
};
_mongoose2.default.set('useCreateIndex', true);
connect();
_mongoose2.default.connection.on('disconnected', connect);

app.use((0, _cookieParser2.default)());
app.use((req, res, next) => {
  const REQUEST_ORIGIN = req.get('origin');
  console.log({ REQUEST_ORIGIN });
  next();
});

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = _jsonwebtoken2.default.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

apollo.applyMiddleware({
  app,
  cors: { origin: 'http://localhost:7777', credentials: true }
});

const server = _http2.default.createServer(app);

// Add subscription support
apollo.installSubscriptionHandlers(server);

server.listen({ port: config.port }, () => console.log('🚀 Server ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`));