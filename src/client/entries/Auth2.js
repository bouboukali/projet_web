import { EventEmitter } from 'events'
import { Auth0LockPasswordless } from 'auth0-lock';
import history from '../react/services/history';

class AuthService extends EventEmitter {


    constructor(clientId, domain) {
        super()


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


        // Here we set the three different authentication options and make them available to use in our template.
        this.loginMagiclink = this.loginMagiclink.bind(this);
        this.loginEmailCode = this.loginEmailCode.bind(this);
        this.loginSMSCode = this.loginSMSCode.bind(this);
    }


    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated() {
        console.log(this.expiresAt)
        return new Date().getTime() < this.expiresAt;
    }

    signIn() {
        this.auth0.authorize();
    }

    signOut() {
        console.log("lool")
        // clear id token, profile, and expiration
        this.idToken = null;
        this.profile = null;
        this.expiresAt = null;
        this.lock.logout({
            returnTo: 'http://localhost:3030/#/callback'
        });
    }

    /*handleAuthentication() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (err) return reject(err);
                if (!authResult || !authResult.idToken) {
                    return reject(err);
                }
                this.idToken = authResult.idToken;
                this.profile = authResult.idTokenPayload;
                // set the time that the id token will expire at
                this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
                resolve();
            });
        })
    }*/


    handleAuthentication() {

        // faire une promesse

        this.lock.on('authorization_error', function (error) {
            console.log(error);
            //history.replace('/login');
        })

        this.lock.on('authenticated', function (authResult) {


            if (authResult && authResult.accessToken && authResult.idToken) {


                /*let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('expires_at', expiresAt);

                */

                this.idToken = authResult.idToken;
                this.profile = authResult.idTokenPayload;
                // set the time that the id token will expire at
                this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

                //history.replace('/home');

            }
        });
    }


    // The next three function implement our three authentication options
    // loginMagiclink - sends the user an email with a link they must click to authenticate
    // loginEmailCode - sends the user an email with a one-time passcode they must enter to authenticate
    // loginSMSCode - sends the user an SMS text message with a one-time passcode they must enter to authenticate
    loginMagiclink() {
        // Ask a user for an email address and send a magiclink that they will need to click on to authenticate
        this.lock.magiclink();
    }
    loginEmailCode() {
        // Ask a user for an email address and send them a one-time passcode to authenticate
        // Here we are also setting the autoclose property to true, meaning once a user is authenticated the lock
        // modal will automatically close.
        this.lock.emailcode({ autoclose: true }, this._doAuthentication.bind(this));
    }
    loginSMSCode() {
        this.lock.show();

    }

    silentAuth() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (err) return reject(err);
                this.setSession(authResult);
                resolve();
            });
        });
    }

}

const Auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);

export default Auth;