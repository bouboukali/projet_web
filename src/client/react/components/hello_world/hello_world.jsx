import React from 'react';
import { Alert } from 'react-bootstrap';
import { withAuthentication } from 'react/contexts/authentication';
import { withRouter } from 'react-router';

class HelloWorld extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.getProfile())
  }

  render() {
    const { name } = this.props;

    return (
      <Alert variant='info'>
        Hello {name}
      </Alert>
    );
  }
}



export default withRouter(withAuthentication(HelloWorld)); // verifier si withRouter est vraiment utile, sinon l'enlever

/**
 * withAuthentication donne accès à : 
 * auth0: WebAuth {baseOptions: {…}, transactionManager: TransactionManager, client: Authentication, redirect: Redirect, popup: Popup, …}
getProfile: ƒ ()
handleAuthentication: ƒ ()
isAuthenticated: false
jwt: null
login: ƒ ()
login2: ƒ ()
logout: ƒ ()
logout2: undefined

withRouter donne accès à : 

history: {length: 50, action: "PUSH", location: {…}, createHref: ƒ, push: ƒ, …}
location: {pathname: "/login", search: "", hash: "", state: undefined}
match: {path: "/login", url: "/login", isExact: true, params: {…}}


 */
