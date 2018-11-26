import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withAuthentication } from 'react/contexts/authentication';


import auth0Client from 'entries/Auth';


class Callback extends Component {


    async componentDidMount() {
        await auth0Client.handleAuthentication();

        //this.props.history.replace('/');
    }
    render() {

        return (
            <div>
                Loading user profile.
        </div>
        );
    }

}





//console.log(props.auth.isAuthenticated())



/*props.handleAuthentication().then(() => {

    //props.history.push('/messages'); // ou replace
})
    .catch(err => {
        console.log("fdjjrhifr")
        // props.history.push('/login');
    });*/




export default withRouter(withAuthentication(Callback));