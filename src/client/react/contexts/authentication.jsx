import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import * as Session from 'react/services/session'
import auth0 from 'auth0-js';
import history from '../services/history';

const AuthenticationContext = React.createContext({

  jwt: null,
  isAuthenticated: false,
  auth0: null,
  login2: () => { },
  handleAuthentication: () => { },
  login: () => { },
  logout: () => { },
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

    const jwt = localStorage.getItem("JWT");
    const isAuthenticated = !!jwt;
    const userProfile = undefined;

    this.state = {
      jwt,
      isAuthenticated,
      auth0: this.auth0,
      userProfile: userProfile

    };

    this.auth0 = new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.CALLBACK_URL,
      responseType: 'token id_token',
      scope: 'openid profile'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.login2 = this.login2.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }


  getProfile() {

    if (!this.state.userProfile) {

      var accessToken = localStorage.getItem('access_token');

      if (!accessToken)
        console.log('Access Token must exist to fetch profile');


      this.auth0.client.userInfo(accessToken, function (err, profile) {

        if (profile) {
          this.setState({ userProfile: profile })
          return this.state.userProfile;
        }
      });

    } else {
      return this.state.userProfile;
    }
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
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/login');
  }




  handleAuthentication() {
    return new Promise((resolve, reject) => {

      this.auth0.parseHash((err, authResult) => {

        if (err) {

          return reject(err);


        }


        console.log(authResult);
        /**
         * authResult contient :
         * 
         * accessToken: "6l3jMWRs4tk9YIjH5WZ7HvY6V3I6pJiB"
         * appState: null
         * expiresIn: 7200
         * idToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJURkdRalZHUVRnek1FRkdNRUV6UlVVMFFqbENSamMxTlVGR01URTBPREl3T0RWRk9EaEZSQSJ9.eyJnaXZlbl9uYW1lIjoiRmxvcmlhbiIsImZhbWlseV9uYW1lIjoiU29sbGFtaSIsIm5pY2tuYW1lIjoiZmxvcmlhbnNvbGxhbWkyMyIsIm5hbWUiOiJGbG9yaWFuIFNvbGxhbWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1aUk1TUkNjaEhLdy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BR0Rndy1qUzlHeVRyb0tCeEVMbXBnUkV4dS1YQ2tJenhBL21vL3Bob3RvLmpwZyIsImdlbmRlciI6Im1hbGUiLCJsb2NhbGUiOiJmciIsInVwZGF0ZWRfYXQiOiIyMDE4LTExLTIwVDIyOjQxOjAzLjA0NVoiLCJpc3MiOiJodHRwczovL3N0ZWVwLXN1bi0wOTkxLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTU4MzMxNDkzODY5NjA2MjM2MSIsImF1ZCI6IlVUSFZEeDhjT0t0TnRSUWlvdFA2N3lCTnBEdzNyMy11IiwiaWF0IjoxNTQyNzUzNjYzLCJleHAiOjE1NDI3ODk2NjMsImF0X2hhc2giOiJWenhnMEFxX0pNbkcyRXE0QUY5a05RIiwibm9uY2UiOiJVQURpS0VmWllFWmFhZ1pRMkN6US5Fb1JEdjFYMlZMYSJ9.ZbchvKw48-u8fR1xELfghBSgUBheTM3D1ErvrzNv89O6kjmMkXI1NOruhw83ezxTEhfXj8zT_DH2IJrsZnJno2rbIYS7hJ-IptPQ0KPvzYYrpXfjRFHT3vQUMV6e7DTdKwplJLcxm0L_abzaiuUMzyeL3DepUpXyomAr1ppb5e3YPTpkEqikZow0kfnbGxehpd8dn-ydgodgmeo0vqzR-AJ5FqLefIXrlgyi7l_hVtXYp7MuuzS7CGvhpWaDGt3jGfoH3p9hxh2jn8SPy6Q4qyEo-jsWwCJzj_3UJ4sRjo2Ms3043pIfEF8Dk21nClU0KBsnjbeKHfYkr14L0jLjkA"
         * idTokenPayload: {given_name: "Florian", family_name: "Sollami", nickname: "floriansollami23", name: "Florian Sollami", picture: "https://lh5.googleusercontent.com/-ZRMSRCchHKw/AAA…A/AGDgw-jS9GyTroKBxELmpgRExu-XCkIzxA/mo/photo.jpg", …}
         * refreshToken: null
         * scope: null
         * state: "DMoQUH7mVynpV3YRSrdZyQ5hT5bTjumV"
         * tokenType: "Bearer"
         */

        if (!authResult || !authResult.idToken) {
          return reject(err);
        }

        Session.setSession(authResult);

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

  render() {
    const { login, logout, login2, logout2, handleAuthentication, getProfile } = this;
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
      logout,
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