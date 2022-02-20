const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config()

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
    }),
     audience: process.env.AUTH0_AUDIENCE,
     issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
});

module.exports = jwtCheck