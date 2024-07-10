const express = require('express');

const authRoutes = require('../routes/auth')
const appRoutes = require('../routes/app');

function createServer(){
    const app = express();

    app.use(express.json());

    app.use(authRoutes);
    app.use(appRoutes);
    
    const unknownEndPoint = (req, res) => {
        res.status(404).send({error: "Unknown Endpoint"});
    }
    // const errorHandler = (error, req, res, next) => {
    //     if(error.name === 'SequelizeValidationError'){
    //         console.log("beau")
    //         return res.status(422).send({error: error.message});
    //     }
    //     next(error);
    // }

    app.use(unknownEndPoint);

    return app;
    
}


module.exports = createServer;