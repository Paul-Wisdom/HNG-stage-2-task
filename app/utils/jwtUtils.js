const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

function generateToken(payload, timeFrame){
    const token = jwt.sign(payload, config.secretKey, {algorithm: 'HS256', expiresIn: timeFrame})
    return token;
}

function verifyToken(token){
    try{
        return jwt.verify(token, config.secretKey)
    }
    catch{
        return null;
    }
    
}

module.exports = {
    generateToken,
    verifyToken
}