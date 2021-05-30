import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const isUserLoggedIn = () => Boolean(localStorage.getItem('_token'));

const PublicRoute = ({ restricted, component: Component, ...restProps }) => (
  <Route
    {...restProps}
    render={props =>
      isUserLoggedIn() && restricted ? (
        <Redirect to="/" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PublicRoute.propTypes = {
  restricted: PropTypes.bool,
  component: PropTypes.elementType.isRequired,
};

export default PublicRoute;
