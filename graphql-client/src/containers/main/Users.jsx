import { gql } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo';

const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const Users = () => {
  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION, {
    refetchQueries: [{ query: ROOT_QUERY }],
  });

  const { loading, error, data, refetch } = useQuery(ROOT_QUERY, {
    // pollInterval: 1000, // You can also add polling in your graphql query...
  });

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Error: {error}
        <button type="button" name="retry" onClick={refetch}>
          Retry
        </button>
      </p>
    );

  const { totalUsers, allUsers } = data;

  return (
    <div className="app">
      <p>Total users: {totalUsers}</p>
      <button
        type="button"
        name="add-user"
        onClick={() => addFakeUsers({ variables: { count: 3 } })}
      >
        Add User
      </button>
      <ul>
        {allUsers.map(({ githubLogin, avatar, name }) => (
          <li key={githubLogin}>
            <img src={avatar} width="48" height="48" alt={name} />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
