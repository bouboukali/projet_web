import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import * as Session from 'react/services/session.js'

import auth0Client from 'entries/Auth';

const AuthenticationContext = React.createContext({
  jwt: null,
  isAuthenticated: false,
  auth: null,
  login: () => { },
  logout: () => { }
});

const AuthenticationConsumer = AuthenticationContext.Consumer;

class AuthenticationProvider extends React.Component {
  constructor(props) {
    super(props);

    const jwt = localStorage.getItem("JWT");
    const isAuthenticated = !!jwt;

    this.state = {
      jwt,
      isAuthenticated,
      auth0Client
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login({ email, password }) {
    return Session
      .createSession(email, password)
      .then(jwt => {
        this.setState({
          jwt: jwt,
          isAuthenticated: !!jwt,
        })
      })
  }
  logout() {
    Session.deleteSession();

    this.setState({
      jwt: null,
      isAuthenticated: false,
    });
  }

  render() {
    const { login, logout } = this;
    const { jwt, isAuthenticated, auth } = this.state;
    const { children } = this.props;

    const providerValues = {
      jwt,
      isAuthenticated,
      auth,
      login,
      logout,
    };
    return (
      <AuthenticationContext.Provider value={providerValues}>
        {children}
      </AuthenticationContext.Provider>
    );
  }
}

const withAuthentication = withContextConsumer(AuthenticationConsumer);

export {
  AuthenticationConsumer,
  AuthenticationProvider,
  withAuthentication,
}