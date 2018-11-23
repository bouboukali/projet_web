import React from 'react';
import { withRouter } from 'react-router';
import { withAuthentication } from 'react/contexts/authentication';

function Callback(props) {


    props.handleAuthentication().then(() => {

        //props.history.push('/messages'); // ou replace
    })
        .catch(err => {
            console.log("fdjjrhifr")
            // props.history.push('/login');
        });

    return (
        <div>
            Loading user profile.
    </div>
    );
}

export default withRouter(withAuthentication(Callback));