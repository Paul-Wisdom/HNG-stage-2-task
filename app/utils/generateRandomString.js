const {v4: uuidv4} = require('uuid');

function generateRandomString(){
    return uuidv4();
}

module.exports = generateRandomString