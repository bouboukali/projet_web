import React from 'react';
import withContextConsumer from 'react/utils/with_context_consumer.jsx';
import history from '../services/history';
import Auth from 'entries/Auth.js';



const AuthenticationContext = React.createContext({

  auth: null,


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

    //const auth = new Auth(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);
    this.state = {
      auth: Auth,
    };

  }


  render() {

    const { auth } = this.state;
    //const { login, logout, handleAuthentication, isAuthenticated, getProfile } = this;
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
      auth
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