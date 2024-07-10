const sequelize = require('./models/index');
const User = require('./models/user');
const Organisation = require('./models/organisation');
const userOrganisation = require('./models/userOrganisation');

const createServer = require('./utils/createServer');
require('dotenv').config()

User.belongsToMany(Organisation, {
    through: userOrganisation
});
Organisation.belongsToMany(User, {
    through: userOrganisation
});

const PORT = process.env.PORT || 3000;

const app = createServer();

sequelize.sync().then(result => {
    console.log("works");
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    });
});

// module.exports = app;