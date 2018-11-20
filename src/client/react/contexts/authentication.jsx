import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import * as Session from 'react/services/session.js'

import auth0 from 'auth0-js';

const AuthenticationContext = React.createContext({

  jwt: null,
  isAuthenticated: false,
  auth0: null,
  login2: () => { },
  logout2: () => { },
  handleAuthentication: () => { },
  login: () => { },
  logout: () => { }


});

const AuthenticationConsumer = AuthenticationContext.Consumer;



class AuthenticationProvider extends React.Component {

  /** this.props contient généralement les props donnés dans le composant :
   *  ex : <MonComposant props1={name} props2={firstname}>
   *           <Layout/>
   *       </MonComposant>
   * Si notre composant contient une balise enfant (Layout), props contiendra en + une clé children
   * {
   *    props1="sollami"
   *    props2="florian"
   *    children: {$$typeof: Symbol(react.element), type: ƒ, key: null, ref: null, props: {…}, …} 
   *  }
   */


  constructor(props) {
    super(props);

    this.auth0 = new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:3030/callback',
      responseType: 'token id_token',
      scope: 'openid'
    });

    const jwt = localStorage.getItem("JWT");



    const isAuthenticated = !!jwt;

    this.state = {
      jwt,
      isAuthenticated,
      auth0: this.auth0
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.login2 = this.login2.bind(this);
    this.logout2 = this.logout2.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }



  login({ email, password }) {

    return Session.createSession(email, password).then(jwt => {
      this.setState({
        jwt: jwt,
        isAuthenticated: !!jwt,
      })
    })
  }

  login2() {
    this.auth0.authorize();
  }

  logout() {
    Session.deleteSession();

    this.setState({
      jwt: null,
      isAuthenticated: false,
    });
  }

  logout2() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
  }

  handleAuthentication() {
    console.log(this.auth0)
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  render() {
    const { login, logout, login2, logout2, handleAuthentication } = this;
    const { jwt, isAuthenticated, auth0 } = this.state;
    const { children } = this.props; // correspond à <Layout/> !!!!!!!!


    /* correspond aux valeurs qui seront accessibles par le ContextConsumer :
    
      function (props) {
  
        <ContextConsumer>
          {
            (context) => <WrappedComponent {...props} {...context} />  <---- ...context = nos valeurs
          }
        </ContextConsumer>
      }
     */
    const providerValues = {
      jwt,
      isAuthenticated,
      auth0,
      login2,
      logout2,
      handleAuthentication,
      login,
      logout
    };


    return (
      <AuthenticationContext.Provider value={providerValues}>
        {children}
      </AuthenticationContext.Provider>
    );
  }
}

/* const AuthenticationConsumer: React.ExoticComponent<React.ConsumerProps<{
          jwt: any;
          login: () => void;
          logout: () => void;
        }>>

  const withAuthentication = ƒunction (WrappedComponent) {
    
    return function (props) {

            <ContextConsumer>
              {
                (context) => <WrappedComponent {...props} {...context} />
              }
            </ContextConsumer>
          }
          }
        
          Après conversion en jsx :
        
  const withAuthentication = ƒunction (WrappedComponent) {
    
    return function (props) {

      return _react2.default.createElement(ContextConsumer, null, function (context)
        {
          return _react2.default.createElement(WrappedComponent, _extends({}, props, context));
        });
    }
  }

*/
// Quand commence par with... = appelé un composant de premier ordre (higher-order component : HOC).
// Autrement dit, c’est une fonction qui accepte un composant et retourne un nouveau composant qui rend (render)
// celui passé en paramètre. Ce nouveau composant est enrichi d'une fonctionnalité supplémentaire.
const withAuthentication = withContextConsumer(AuthenticationConsumer);

export {
  AuthenticationConsumer,
  AuthenticationProvider,
  withAuthentication,
}