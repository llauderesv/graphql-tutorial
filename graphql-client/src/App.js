import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './components';
import Auth from './containers/auth';
import Main from './containers/main';

const App = () => (
  <BrowserRouter>
    <Switch>
      <PublicRoute restricted path="/auth" component={Auth} />
      <PrivateRoute render={() => <Main />} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default App;
