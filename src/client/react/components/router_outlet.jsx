import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";

import { withAuthentication } from "react/contexts/authentication";
import HelloWorld from "./hello_world/hello_world";
import HelloFromParams from "./hello_world/hello_from_params";
import TodoAppContainer from "./todo_app/todo_app_container";
import MessagesContainer from "./messages/messages_container";
import MessageContainer from "./message/message_container";
import LoginContainer from "./login/login_container";

import Callback from './callback/Callback';



function RouterOutlet({ handleAuthentication, auth0, isAuthenticated, location }) {


  const redirectToLogin = !isAuthenticated && location.pathname !== "/login";


  return (

    /**
     * Quand on lance le site : http://localhost:3030/ on est pas connecté et on est pas sur le path /login, 
     * donc redirectToLogin = true --> redirection vers http://localhost:3030/login,
     * 
     * 
     * En faisant cette redirection, le composant RouterOutlet est de nouveau render, 
     * on est pas connecté et on est  sur le path /login, donc redirectToLogin = false, donc on a accès à
     * toutes les routes et le composant de la route /login est render
     */

    <React.Fragment>

      {/*redirectToLogin && <Redirect to="/login" />*/}
      {/*!redirectToLogin && */

        /* render={() => <HelloWorld/> ======= render={(props) => <HelloWorld {...props} */

        <React.Fragment>
          <Route exact path="/" render={() => <HelloWorld name="bob" />} />
          <Route path="/hello/:name" component={HelloFromParams} />
          <Route path="/todo" component={TodoAppContainer} />
          <Route path="/messages" component={MessagesContainer} />
          <Route path="/message/:id" component={MessageContainer} />


          <Route path="/login" component={LoginContainer} />





          <Route exact path='/:access_token(access_token=.*)' render={(props) => (

            <Callback {...props} />
          )} />




        </React.Fragment>
      }
    </React.Fragment>
  );
}



// ContextConsumer = AuthenticationConsumer
// WrappedComponent = RouterOutlet


/* withAuthentication(RouterOutlet) = function (props) {

        <ContextConsumer> // ContextConsumer emballe WrappedComponent
          {
            (context) => <WrappedComponent {...props} {...context} />

           // ... props = donnés par withRouter****** 
            history: {length: 2, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
            location: {pathname: "/login", search: "", hash: "", state: undefined}
            match: {path: "/", url: "/", params: {…}, isExact: false}

         // ... context = les valeurs transmises par le Provider (AuthenticationContext.Provider)
      }
      </ContextConsumer>
      }

      ****** withRouter permet you can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component.
      withRouter will pass updated match, location, and history props to the wrapped component
      whenever it renders.
    
      withRouter(withAuthentication(RouterOutlet)) = withRouter emballe withAuthentication(RouterOutlet)
      Faut l'imaginer comme
    
  <WithRouter>
          <AuthenticationConsumer>
            <RouterOutlet />
          </AuthenticationConsumer>
        </WithRouter>

        */
export default withRouter(withAuthentication(RouterOutlet)); // en fait on le fait pour connaitre dans RouterOutlet sur quelle page on se trouve (pathname)
