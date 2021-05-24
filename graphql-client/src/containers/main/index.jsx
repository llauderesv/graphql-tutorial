import { Switch, Route, Redirect } from 'react-router-dom';
import Users from './Users';

const Root = () => (
  <Switch>
    <Route path="/" component={Users} />
    <Redirect from="*" to="/" />
  </Switch>
);

export default Root;
