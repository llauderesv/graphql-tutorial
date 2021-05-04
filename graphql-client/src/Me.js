import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { useEffect } from 'react';

const ME_QUERY = gql`
  query me {
    me {
      githubLogin
      name
      avatar
    }
  }
`;

const Me = ({ logout, requestCode, signIn }) => {
  const { loading, error, data, refetch } = useQuery(ME_QUERY);

  useEffect(() => {
    signIn && refetch();
  }, [signIn]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(data);

  if (!data.me) {
    return (
      <button onClick={requestCode} disabled={signIn}>
        Sign In with Github
      </button>
    );
  }

  const {
    me: { avatar, name },
  } = data;

  return (
    <div>
      <img src={avatar} width={48} height={48} alt={name} />
      <h1>{name}</h1>

      <button onClick={logout}>Sign out</button>
    </div>
  );
};

export default Me;
