import { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import Me from './Me';

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const ALL_USERS = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const AuthorizedUser = () => {
  const history = useHistory();
  const [signIn, setSignIn] = useState(false);

  const authorizationComplete = (cache, { data }) => {
    localStorage.setItem('_token', data.githubAuth.token);
    history.replace('/');
    setSignIn(true);
  };

  const [githubSignIn, { loading }] = useMutation(GITHUB_AUTH_MUTATION, {
    update: authorizationComplete,
    refetchQueries: [{ query: ALL_USERS }],
  });

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      const code = window.location.search.replace('?code=', '');
      githubSignIn({ variables: { code } });
    }
  }, []);

  const onSignInGithub = () => {
    const clientID = 'Iv1.d0f156a0fdfb0aa7';

    // Redirects to github
    window.location =
      'https://github.com/login/oauth/authorize?client_id=' +
      clientID +
      '&redirect_uri=http://localhost:3000&scope=user';
  };

  const onLogout = () => {
    localStorage.removeItem('_token');
    window.location = '/';
  };

  if (loading) return <p>Signing In...</p>;

  return <Me logout={onLogout} requestCode={onSignInGithub} signIn={signIn} />;
};

export default AuthorizedUser;
