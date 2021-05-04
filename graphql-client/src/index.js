import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import AuthorizedUser from './AuthorizedUser';

import reportWebVitals from './reportWebVitals';

const render = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    request: operation => {
      operation.setContext(context => ({
        headers: {
          ...context.headers,
          authorization: localStorage.getItem('_token'),
        },
      }));
    },
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <React.StrictMode>
          <AuthorizedUser />
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
