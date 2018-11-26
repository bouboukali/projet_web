import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withAuthentication } from 'react/contexts/authentication';

import { Redirect } from 'react-router-dom';
import auth0Client from 'entries/Auth';
import sendApiRequest from "react/utils/api";
import CallbackComponent from './callback_component';

import axios from 'axios';

class CallbackContainer extends Component {

    constructor(props) {

        //props.handleAuthentication(); /*bizarre de l'appeler là mais bon*/

        super(props);


        this.state = {
            email: "",
            name: "",
            firstname: "",
            phone: "",
            user: null,
        };

        this.submit = this.submit.bind(this);
        this.inscription = this.inscription.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    async componentDidMount() {
        await auth0Client.handleAuthentication();
        console.log(auth0Client.isAuthenticated());
        //this.props.history.replace('/');
    }


    async submit(event) {

        event.preventDefault();

        console.log(auth0Client.getIdToken())

        const { email, name, firstname, phone } = this.state;
        console.log(this.state)

        await axios.post('/api/test/', {

            email: email,
            name: name,
            firstname: firstname,
            phone: phone,
        }, {
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
            })

            .then((user) => {
                console.log(user);
                this.setState({
                    user: user,
                })
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    user: null,
                })

            });

        //this.props.history.push('/');
    }





    onFieldChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    // event est un SyntheticEvent
    // appelé quand appuyé sur submit button
    inscription(event) {

        /*const { login } = this.props; // méthode login
        const { email, password } = this.state; // PROF AVAIT MIS this.props ERREUR ???*/
        const { email, phone, name } = this.state;
        event.preventDefault();

        sendApiRequest({
            url: "/api/callbacks", method: "POST",
            params: {
                email: email,
                name: name,
                phone: phone
            }
        })
            .then((user) => {
                console.log(user);
                this.setState({
                    user: user,
                })
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    user: null,
                })
                /*this.setState({
                  messages: [],
                })*/
            })

    }


    render() {

        const { email, name, firstname, phone, user } = this.state;


        return (

            <React.Fragment>

                {user != null && <Redirect to="/messages" />}
                {user == null &&
                    <CallbackComponent
                        email={email}
                        name={name}
                        firstname={firstname}
                        phone={phone}
                        inscription={this.submit}
                        onFieldChange={this.onFieldChange}

                    >

                    </CallbackComponent>


                }
            </React.Fragment>
        )
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




export default withRouter(withAuthentication(CallbackContainer));