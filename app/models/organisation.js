const sequelize = require('./index');
const Sequelize = require('sequelize');

const Organisation = sequelize.define('organisation', {

    orgId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    }, 

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Organisation;