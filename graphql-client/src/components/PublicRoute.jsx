import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const isUserLoggedIn = () => Boolean(localStorage.getItem('_token'));

const PublicRoute = ({
  render,
  restricted,
  component: Component,
  ...restProps
}) => (
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
  render: PropTypes.func.isRequired,
  restricted: PropTypes.bool,
  component: PropTypes.element,
};

export default PublicRoute;
