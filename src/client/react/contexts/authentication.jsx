import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import * as Session from 'react/services/session.js'

import auth0 from 'auth0-js';

const AuthenticationContext = React.createContext({

  jwt: null,
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
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

    const jwt = localStorage.getItem("JWT");

    /*this.auth0 = new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:3030/callback',
      responseType: jwt,// rajouté nore token jwt si jme trompe ps
      scope: 'openid'
    });*/

    const isAuthenticated = !!jwt;

    this.state = {
      jwt,
      isAuthenticated,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }



  login({ email, password }) {

    return Session.createSession(email, password).then(jwt => {
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
    const { jwt, isAuthenticated } = this.state;
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