var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://steep-sun-0991.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: "https://steep-sun-0991.eu.auth0.com/",
    algorithms: ['RS256']
});
exports.jwtCheck = jwtCheck;