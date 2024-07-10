const sequelize = require('./index');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {

    userId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    }, 

    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;