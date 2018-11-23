import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import * as Session from 'react/services/session'
import auth0 from 'auth0-js';
import history from '../services/history';

const AuthenticationContext = React.createContext({

  auth0: null,
  login: () => { },
  logout: () => { },
  handleAuthentication: () => { },
  isAuthenticated: () => { },
  getProfile: () => { }


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
      redirectUri: process.env.NODE_ENV === 'development' ? process.env.CALLBACK_URL_DEVELOPMENT : process.env.CALLBACK_URL_PRODUCTION,
      responseType: 'token id_token',
      scope: 'openid profile'
    });

    this.state = {
      auth0: this.auth0,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    console.log(this.isAuthenticated())
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    console.log(this.isAuthenticated())
    // navigate to the home route
    history.replace('/');
  }

  handleAuthentication() {

    return new Promise((resolve, reject) => {

      this.auth0.parseHash((err, authResult) => {

        //console.log(authResult)

        if (err) {
          console.log("hujhudhuehduhehedue")
          return reject(err);
        }

        // console.log(authResult);

        if (!authResult || !authResult.idToken) {
          return reject(err);
        }

        Session.setSession(authResult);
        //history.replace('/messages');

        resolve();
      });
    })
  }

  // pas expiré = authentifié
  isAuthenticated() {
    // Check whether the current time is past the 
    // Access Token's expiry time

    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  getProfile() {

    if (!this.state.userProfile) {

      var accessToken = localStorage.getItem('access_token');

      if (!accessToken)
        console.log('Access Token must exist to fetch profile');

      this.auth0.client.userInfo(accessToken, function (err, profile) {

        if (profile) {
          this.setState({ userProfile: profile }) // comme on est dans une fonction on perd le this
          return this.state.userProfile;
        }
      });

    } else {
      return this.state.userProfile;
    }
  }
  render() {

    const { auth0 } = this.state;
    const { login, logout, handleAuthentication, isAuthenticated, getProfile } = this;
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
      auth0,
      login,
      logout,
      handleAuthentication,
      isAuthenticated,
      getProfile
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