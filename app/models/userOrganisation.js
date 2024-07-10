const sequelize = require('./index');
const Sequelize = require('sequelize');

const userOrganisation = sequelize.define('userOrganisation', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    }, 

});

module.exports = userOrganisation;