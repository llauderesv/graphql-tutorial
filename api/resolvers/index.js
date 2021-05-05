import { authorizeWithGithub } from '../lib';
import fetch from 'node-fetch';
import { toJson } from '../lib';

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
  Query: {
    me: (_, args, { currentUser }) => currentUser,
    totalPhotos: (_, args, { db }) =>
      db.collection('photos').estimatedDocumentCount(),
    allPhotos: (_, args, { db }) => db.collection('photos').find().toArray(),
    totalUsers: (_, args, { db }) =>
      db.collection('users').estimatedDocumentCount(),
    allUsers: (_, args, { db }) => db.collection('users').find().toArray(),
  },
  Mutation: {
    async postPhoto(parent, args, { db, currentUser }) {
      if (!currentUser) {
        throw new Error('only authorized user can post a photo');
      }

      const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin, // save the current user id who created a photo...
        created: new Date(),
      };

      const { insertedIds } = await db.collection('photos').insert(newPhoto);
      newPhoto.id = insertedIds[0];

      return newPhoto;
    },
    async githubAuth(parent, { code }, { db }) {
      let {
        message,
        access_token,
        avatar_url,
        login,
        name,
      } = await authorizeWithGithub({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      });

      // 2. If there is a message, something went wrong
      if (message) {
        throw new Error(message);
      }
      // 3. Package the results into a single object
      let latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      // 4. Add or update the record with the new information
      const {
        ops: [user],
      } = await db
        .collection('users')
        .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
      // 5. Return user data and their token
      return { user, token: access_token };
    },
    async addFakeUsers(parent, { count }, { db }) {
      const randomUserApi = `https://randomuser.me/api/?results=${count}`;
      const { results } = await fetch(randomUserApi).then(toJson);

      const users = results.map(r => ({
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1,
      }));

      await db.collection('users').insert(users);
      return users;
    },
  },
};

export default resolvers;
