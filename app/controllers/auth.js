const User = require('../models/user');
const config = require('../config/auth.config')

const generateRandomString = require('../utils/generateRandomString');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postSignUp = (req, res, next) => {
    // const {firstName, lastName, email, password, phone} = req.body;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    let payload;

    if(!firstName)
        {
            return res.status(422).send({errors: [{fields: 'firstName', error: 'user.firstName cannot be null'}]});
        }
    if(!lastName)
        {
            return res.status(422).send({errors: [{fields: 'lastName', error: 'user.lastName cannot be null'}]});
        }
    if(!email)
        {
            return res.status(422).send({errors: [{fields: 'email', error: 'user.email cannot be null'}]});
        }
    if(!password)
        {
            return res.status(422).send({errors: [{fields: 'password', error: 'user.password cannot be null'}]});
        }
    if(!phone)
        {
            return res.status(422).send({errors: [{fields: 'phone', error: 'user.phone cannot be null'}]});
        }
    User.findOne({where: {email: email}}).then(user => {
        if(user)
            {
                console.log(user);
                return res.status(422).send({errors: [{fields: 'email', error: 'user.email must be unique'}]});
            }
            bcrypt.hash(password, 12).then(hashedPwd => {
                return User.create({userId: generateRandomString(), firstName: firstName, lastName: lastName, email: email, password: hashedPwd, phone: phone});
            }).then(result => {
                console.log(result)
                payload = result;
                return result.createOrganisation({orgId: generateRandomString(), name: `${firstName}'s Organisation`, description: `Default Organisation created for ${firstName} ${lastName}`})
            }).then(result => {
                const token = jwt.sign({id: payload.userId}, config.secretKey, {algorithm: 'HS256', expiresIn: '1h'});
                return res.status(201).send({
                    status: "success", 
                    message: "Registration successful", 
                    data: {
                        accessToken: token,
                        user: {
                            userId: payload.userId, 
                            firstName: payload.firstName, 
                            lastName: payload.lastName, 
                            email: payload.email, 
                            phone: payload.phone
                        }}});
            })
    }).catch(err => {
        console.log(err.name);
        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ){
            const errors = err.errors.map(errorItem => {
                return {fields: errorItem.path, message: errorItem.message}
            });
            console.log(errors);
            return res.status(422).send({errors: errors});
        }

        return res.status(400).send({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400
        })
    })
}

const postSignIn = (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errorMessage = {status: "Bad request", message: "Authentication failed", statusCode: 401}
    let loggedUser;

    if(!email || !password)
        {
            return res.status(401).send(errorMessage);
        }

    User.findOne({where: {email: email}}).then(user => {
        console.log(user);
        if(!user)
            {
                return res.status(401).send(errorMessage);
            }
        loggedUser = user;
        bcrypt.compare(password, user.password).then(match => {
            if(!match)
                {
                    return res.status(401).send(errorMessage);
                }
                const token = jwt.sign({id: loggedUser.userId}, config.secretKey, {algorithm: 'HS256', expiresIn: '1h'});
                return res.status(200).send({
                    status: "success", 
                    message: "Login successful", 
                    data: {
                        accessToken: token,
                        user: {
                            userId: loggedUser.userId, 
                            firstName: loggedUser.firstName, 
                            lastName: loggedUser.lastName, 
                            email: loggedUser.email, 
                            phone: loggedUser.phone
                        }}});
        })
    }).catch(err => {
        console.log(err);
    })
}

const protectedRoute = (req, res, next) => {
    let token = req.headers['authorization']
    console.log(token);
    if(!token)
    {
        return res.status(401).send({status: "Bad Request", message: "No token detected", statusCode: 401});
    }
    token = token.split(' ')[1];
    if(!token)
        {
            return res.status(401).send({status: "Bad Request", message: "No token detected", statusCode: 401});
        }
    jwt.verify(token, config.secretKey, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({status: "Bad Request", message: "Invalid token detected", statusCode: 401});
        }

        if(!err)
            {
                console.log(decoded);
                req.user_id = decoded.id;
                next();
            }
    })
}

module.exports = {
    postSignUp,
    postSignIn,
    protectedRoute
}