import React from 'react';
import { withRouter } from 'react-router';
import { withAuthentication } from 'react/contexts/authentication';

function Callback(props) {


    props.handleAuthentication().then(() => {

        props.history.push('/');
    })
        .catch(err => {
            props.history.push('/login');
        });

    return (
        <div>
            Loading user profile.
    </div>
    );
}

export default withRouter(withAuthentication(Callback));