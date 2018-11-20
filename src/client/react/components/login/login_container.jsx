import React from 'react';
import { Redirect } from 'react-router-dom';

import { withAuthentication } from 'react/contexts/authentication';
import LoginComponent from './login_component';

/**
 * props contient : 
 * 
 *  history: {length: 50, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
 *  location: {pathname: "/login", search: "", hash: "", state: undefined}
 *  match: {path: "/login", url: "/login", isExact: true, params: {…}}
 *  C'EST LA ROUTE QUI NOUS TRANSMET CES PROPS https://stackoverflow.com/questions/32901538/how-does-react-router-pass-params-to-other-components-via-props
 * 
 * et aussi : 
 *  isAuthenticated: true ou false
 *  jwt: null ou le jwt
 *  login: ƒ ()
 *  logout: ƒ ()
 * 
 * OBTENUS PAR LE HOC (higher-order component) withAuthentication(LoginContainer)
 *
 */

/**
 * Container component pattern :
 * 
 * Un conteneur collecte les données et rend (render) ensuite le sous-composant correspondant (login_component).
 * Permet de séparer la collecte des données et le rendu.
 * Permet de réutiliser le composant login_component.

 */
class LoginContainer extends React.Component {


    constructor(props) {

        super(props);

        console.log(props)

        this.state = {
            email: "",
            password: "",
        };

        this.authenticate = this.authenticate.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    /**
     * event est un SyntheticEvent
     * 
     * chaque lettre introduite dans l'input appelle la fonction onFieldChange
     * 
     * event.target = <input name="email" placeholder="Email" type="email" id="formHorizontalEmail" class="form-control" value="f">
     * event.tatget = <input name="email" placeholder="Email" type="email" id="formHorizontalEmail" class="form-control" value="fl">
     * ...
     * event.target = <input name="email" placeholder="Email" type="email" id="formHorizontalEmail" class="form-control" value="florian@hotmail.fr">
     * 
     * 
     * <input name="password" placeholder="Password" type="password" id="formHorizontalPassword" class="form-control" value="l">
     * <input name="password" placeholder="Password" type="password" id="formHorizontalPassword" class="form-control" value="la">
     * ...
     * <input name="password" placeholder="Password" type="password" id="formHorizontalPassword" class="form-control" value="laurent">
     * 
     * 
     **/
    onFieldChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    // event est un SyntheticEvent
    // appelé quand appuyé sur submit button
    authenticate(event) {

        const { login } = this.props; // méthode login
        const { email, password } = this.state; // PROF AVAIT MIS this.props ERREUR ???

        event.preventDefault();
        login({ email, password }); // methode de authentication.jsx

    }


    render() {
        const { email, password, } = this.state;
        const { jwt, } = this.props;
        const authenticated = !!jwt;

        return (

            <React.Fragment>

                {authenticated && <Redirect to="/messages" />}
                {!authenticated &&
                    <LoginComponent
                        email={email}
                        password={password}
                        authenticate={this.authenticate}
                        onFieldChange={this.onFieldChange}
                        login = {this.props.login2}
                    />
                }
            </React.Fragment>
        )
    }

}

// Quand commence par with... = appelé un composant de premier ordre (higher-order component : HOC).
// Autrement dit, c’est une fonction qui accepte un composant et retourne un nouveau composant qui rend (render)
// celui passé en paramètre. Ce nouveau composant est enrichi d'une fonctionnalité supplémentaire ( jwt, isAuthenticated, login, logout,)
export default withAuthentication(LoginContainer); 