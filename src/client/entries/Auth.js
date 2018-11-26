import { Auth0LockPasswordless } from 'auth0-lock';
import { EventEmitter } from 'events'

class Auth extends EventEmitter {
    constructor(clientId, domain) {
        super();



        this.lock = new Auth0LockPasswordless(clientId, domain, {
            allowedConnections: ['sms'],
            auth: {
                redirectUrl: process.env.NODE_ENV === 'development' ? process.env.CALLBACK_URL_DEVELOPMENT : process.env.CALLBACK_URL_PRODUCTION,
                responseType: 'token id_token'
            }
        });



        this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated() {

        console.log(new Date().getTime() + " < " + this.expiresAt)
        return new Date().getTime() < this.expiresAt;
    }

    signIn() {

        //this.auth0.authorize();
        this.lock.show();
    }

    handleAuthentication() {


        /*this.lock.on('authenticated', function (authResult) {

            if (authResult && authResult.accessToken && authResult.idToken) {
                console.log("okkkkk")
                console.log(authResult)
               
                this.idToken = authResult.idToken;
                this.profile = authResult.idTokenPayload;
                
                this.expiresAt = authResult.idTokenPayload.exp * 1000;

            }
        });*/

        return new Promise((resolve, reject) => {

            this.lock.on('authenticated', function (authResult) {

                /*if (!authResult || !authResult.idToken) {
                    return reject(err);
                }*/

                this.setSession(authResult);
                resolve();

            }.bind(this));

            /*this.auth0.parseHash((err, authResult) => {
                 if (err) return reject(err);
                 if (!authResult || !authResult.idToken) {
                     return reject(err);
                 }
                 this.setSession(authResult);
                 resolve();
             });*/
        })
    }

    setSession(authResult) {
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;

        //console.log(this.isAuthenticated())
    }

    signOut() {

        this.lock.logout({
            returnTo: process.env.NODE_ENV === 'development' ? process.env.LOGOUT_URL_DEVELOPMENT : process.env.LOGOUT_URL_PRODUCTION
        });
    }

    silentAuth() {
        return new Promise((resolve, reject) => {


            this.lock.checkSession({}, (err, authResult) => {

                console.log(err)

                if (err)
                    return reject(err);

                console.log(authResult)

                this.setSession(authResult);
                resolve();
            });
        });
    }
}



const auth0Client = new Auth(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);

export default auth0Client;
