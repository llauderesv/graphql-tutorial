import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import { readFileSync } from 'fs';
import path from 'path';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = readFileSync(
  path.resolve(__dirname, 'typeDefs.graphql'),
  'utf-8'
);

let _id = 0;

const users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' },
];

const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
  },
];

const tags = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattrup' },
  { photoID: '2', userID: 'gPlake' },
];

// Resolver is used to resolved the query from the client to the associated data source to be connected with in graphql.
const resolvers = {
  Photo: {
    created: parent => new Date().toISOString(),
    url: parent => {
      console.log(parent);
      return `http://yoursite.com/img/${parent.id}.jpg`;
    },
    taggedUsers: parent =>
      tags
        .filter(tag => tag.photoID === parent.id)
        .map(({ userID }) => users.find(u => u.githubLogin === userID)), // Get user taggedPhoto from users array...
    postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
  },
  User: {
    postedPhotos: parent =>
      photos.filter(x => x.githubUser === parent.githubLogin),
    inPhotos: parent =>
      tags
        .filter(tag => tag.userID === parent.githubLogin)
        .map(({ photoID }) => photos.find(p => p.id === photoID)),
  },
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    allUsers: () => users,
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
      };

      photos.push(newPhoto);
      return newPhoto;
    },
  },
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.get('/', (req, res) => res.end('Hello World!'));

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `GraphQL Server running @ http://localhost:${PORT}{server.graphqlPath}`
  );
});

// server.listen().then(({ url }) => console.log(`Server ready at ${url}`));

// Design your schema based on how data is used, not based on how it's stored.
