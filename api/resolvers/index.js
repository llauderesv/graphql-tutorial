import Mutation from './Mutation';
import Query from './Query';

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
// The parent parameter in resolver is the context or it refers to the properties of a Type that you defined in graphql.
const resolvers = {
  Photo: {
    id: parent => parent.id || parent._id,
    // created: parent => new Date().toISOString(),
    url: parent => {
      console.log(parent);
      return `/img/photos/${parent._id}.jpg`;
    },
    taggedUsers: parent =>
      tags
        .filter(tag => tag.photoID === parent.id)
        .map(({ userID }) => users.find(u => u.githubLogin === userID)), // Get user taggedPhoto from users array...
    postedBy: (parent, args, { db }) =>
      db.collection('users').findOne({ githubLogin: parent.userID }),
  },
  User: {
    postedPhotos: parent =>
      photos.filter(x => x.githubUser === parent.githubLogin),
    inPhotos: parent =>
      tags
        .filter(tag => tag.userID === parent.githubLogin)
        .map(({ photoID }) => photos.find(p => p.id === photoID)),
  },
  Query,
  Mutation,
};

export default resolvers;
