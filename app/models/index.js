const Sequelize = require('sequelize');
const Postgres = require('@sequelize/postgres');
const {db_name, db_user, db_password} = require('../config/db.config');

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;