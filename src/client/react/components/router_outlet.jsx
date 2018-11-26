import React, { Component } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";

import { withAuthentication } from "react/contexts/authentication";
import HelloWorld from "./hello_world/hello_world";
import HelloFromParams from "./hello_world/hello_from_params";
import TodoAppContainer from "./todo_app/todo_app_container";
import MessagesContainer from "./messages/messages_container";
import MessageContainer from "./message/message_container";
import LoginContainer from "./login/login_container";

import CallbackContainer from './callback/callback_container';

import auth0Client from 'entries/Auth';
import SecuredRoute from '../SecuredRoute/SecuredRoute';

class RouterOutlet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkingSession: true,
    }
  }

  async componentDidMount() {

    var regex = /\/access_token=.*/;

    if (regex.test(this.props.location.pathname)) {
      this.setState({ checkingSession: false });
      return;
    }

    try {

      await auth0Client.silentAuth();
      this.forceUpdate();

    } catch (err) {
      console.log(err)

      if (err.error !== 'login_required')
        console.log(err.error);
    }

    this.setState({ checkingSession: false });
  }

  render() {
    return (

      //const redirectToLogin = !auth0Client.isAuthenticated() && pathname !== "/login";
      <React.Fragment>
        {/*redirectToLogin && <Redirect to="/login" />}
        {!redirectToLogin &&*/
          <React.Fragment>
            <Route exact path="/" render={() => <HelloWorld name="bob" />} />
            <Route path="/hello/:name" component={HelloFromParams} />




            <Route path="/todo" component={TodoAppContainer} />
            <Route path="/messages" component={MessagesContainer} />


            <Route path="/message/:id" component={MessageContainer} />
            <Route path="/login" component={LoginContainer} />
            <Route path='/:access_token(access_token=.*)' render={(props) => {




              return <CallbackContainer {...props} />
            }} />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

}


export default withRouter(withAuthentication(RouterOutlet));
