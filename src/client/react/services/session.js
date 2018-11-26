import sendApiRequest from "react/utils/api";
import history from '../services/history';

function storeJWT(jwt) {

    const serialized = JSON.stringify(jwt);
    localStorage.setItem("JWT", serialized);

}

function retrieveJWT() {
    const serialized = localStorage.getItem("JWT");
    return JSON.parse(serialized);
}

function clearJWT() {
    localStorage.removeItem("JWT");
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
}

const createSession = (phone) => {
    console.log("create")
    console.log(phone)
    return sendApiRequest({
        url: "/api/sessions",
        method: "POST",
        params: {
            phone: phone
        }
    })
        .then(data => {//continuer
            return data;
        })
        .catch(() => {
        })

};

const deleteSession = () => {
    clearJWT();
};

function setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

}








export {
    createSession,
    deleteSession,
    retrieveJWT,
    setSession
};