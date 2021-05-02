import fetch from 'node-fetch';

const toJson = res => res.json();
const throwError = error => new Error(`Error ocurred: ${throwError}`);

const requestGithubToken = ({ code, client_id, client_secret }) =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id,
      client_secret,
    }),
  })
    .then(toJson)
    .catch(throwError);

const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(toJson)
    .catch(throwError);

async function authorizeWithGithub(credentials) {
  const { access_token } = await requestGithubToken(credentials);
  console.log(access_token);
  const githubUser = await requestGithubUserAccount(access_token);

  return { ...githubUser, access_token };
}

async function githubAuth(parent, { code }, { db }) {
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
}

export { toJson, throwError };

export default githubAuth;
