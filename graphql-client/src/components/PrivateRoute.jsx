import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const isUserLoggedIn = () => Boolean(localStorage.getItem('_token'));

const PrivateRoute = ({ render }) => (
  <Route
    render={({ location, ...rest }) =>
      isUserLoggedIn() ? (
        render({ ...rest, location })
      ) : (
        <Redirect to={{ pathname: '/auth/signin', state: location }} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  render: PropTypes.func.isRequired,
};

export default PrivateRoute;
