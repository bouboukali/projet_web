import { Auth0LockPasswordless } from 'auth0-lock';
import { EventEmitter } from 'events';
import axios from 'axios';

class Auth extends EventEmitter {
    constructor(clientId, domain) {
        super();
        this.type=null;


        this.lock = new Auth0LockPasswordless(clientId, domain,{
            auth:{
                redirectUrl: process.env.NODE_ENV === 'development' ? process.env.CALLBACK_URL_DEVELOPMENT : process.env.CALLBACK_URL_PRODUCTION,
                responseType: 'token id_token'
            }
        });
        

        this.getType = this.getType.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signIn2 = this.signIn2.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    getType(){
        return this.type;
    }
    getUser(){
        console.log(this.getType())
        if(this.getType()=='sms'){  
            return new Promise((resolve,reject) =>{
                axios.post('/api/callbacks/session', {
                    phone: this.profile.nickname,
                }, {
                        headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
                    })

                    .then((user) => {  
                        console.log(user)             
                            resolve(user.data);
                    })
                    .catch((error) => {
                        reject(error);

                    });
            })
        }else{
            console.log(this.profile.name)
            return new Promise((resolve,reject) =>{
                axios.post('/api/callbacks/sessionEmail', {
                    email: this.profile.name,
                }, {
                        headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
                    })
        
                    .then((user) => {  
                        console.log(user)             
                            resolve(user.data);
                    })
                    .catch((error) => {
                        reject(error);
        
                    });
            })
        } 
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
      const  options = {
            allowedConnections: ['sms'],
           
        };
        
        this.lock.show(options);
    }
    signIn2() {
        const  options = {
            allowedConnections: ['email'],
            passwordlessMethod: 'code',
            
        };
        this.lock.show(options);
    }

    handleAuthentication() {

        console.log(this.type)
        return new Promise((resolve, reject) => {

            this.lock.on('authenticated', function (authResult) {

                this.setSession(authResult);
                resolve();

            }.bind(this));
        })
    }

    setSession(authResult) {
        console.log(authResult);
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        console.log(this.profile)
        if(this.profile.email !=null){
            this.type = 'email';
        }else{
            this.type = 'sms';
        }
        console.log(this.type);
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;

    }

    signOut() {

        this.lock.logout({
            returnTo: process.env.NODE_ENV === 'development' ? process.env.LOGOUT_URL_DEVELOPMENT : process.env.LOGOUT_URL_PRODUCTION
        });
        localStorage.removeItem("name");
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
