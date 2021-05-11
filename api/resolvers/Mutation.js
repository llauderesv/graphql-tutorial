import fetch from 'node-fetch';
import { toJson, authorizeWithGithub } from '../lib';

export default {
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
    const { message, access_token, avatar_url, login, name } =
      await authorizeWithGithub({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      });

    // 2. If there is a message, something went wrong
    if (message) {
      throw new Error(message);
    }
    // 3. Package the results into a single object
    const latestUserInfo = {
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
};
