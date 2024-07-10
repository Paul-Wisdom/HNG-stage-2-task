require('dotenv').config();
const secretKey = process.env.JWT_SCR_KEY

module.exports = {
    secretKey
}