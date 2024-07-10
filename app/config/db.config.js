require('dotenv').config();
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;

module.exports = {
    db_name,
    db_user,
    db_password
}