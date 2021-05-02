import express from 'express';
import mongodb from 'mongodb';
import { readFileSync } from 'fs';
import { ApolloServer } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import resolvers from './resolvers';
import dotenv from 'dotenv';

const { MongoClient } = mongodb;

// Loads .env file into process.env process in Node JS...
dotenv.config();

// start asynchronously the express app...
(async function () {
  // A schema is a collection of type definitions (hence "typeDefs")
  // that together define the "shape" of queries that are executed against
  // your data.
  const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');

  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async function ({ req }) {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });
      return { db, currentUser };
    },
  });

  server.applyMiddleware({ app });

  const _expressPlayground = expressPlayground.default;

  app.get('/', (req, res) => res.end('Hello World!'));
  app.get('/playground', _expressPlayground({ endpoint: '/graphql' }));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(
      `GraphQL Server running @ http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
