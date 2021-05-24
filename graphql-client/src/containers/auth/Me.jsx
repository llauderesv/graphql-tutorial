import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

const ME_QUERY = gql`
  query me {
    me {
      githubLogin
      name
      avatar
    }
  }
`;

const Me = ({ logout }) => {
  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const {
    me: { avatar, name },
  } = data;

  return (
    <div>
      <img src={avatar} width={48} height={48} alt={name} />
      <h1>{name}</h1>

      <button type="button" onClick={logout}>
        Sign out
      </button>
    </div>
  );
};

Me.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Me;
