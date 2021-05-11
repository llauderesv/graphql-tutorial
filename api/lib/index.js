import fetch from 'node-fetch';

const toJson = res => res.json();
const throwError = error => new Error(`Error ocurred: ${error}`);

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

export { toJson, throwError, authorizeWithGithub };

export default authorizeWithGithub;
