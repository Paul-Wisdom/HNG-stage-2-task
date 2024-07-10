const User = require('../models/user');
const Organisation = require('../models/organisation');
const userOrganisation = require('../models/userOrganisation');

const generateRandomString = require('../utils/generateRandomString');

const {Op} = require('sequelize');
// const sequelize = require('../models');

const getUser = (req, res, next) => {
    const id = req.params.id;
    const user_id = req.user_id;

    console.log(user_id);
    console.log(id)
    userOrganisation.findAll({
        where: { userUserId: user_id},
        attributes: ['organisationOrgId']
    }).then(userOrgs => {
        userOrgs = userOrgs.map(u => u.organisationOrgId)
        console.log(userOrgs);
        return userOrganisation.findAll({
            where: {
                userUserId: id,
                organisationOrgId: {
                    [Op.in]: userOrgs
                }
            }
        })
    }).then(commonOrgs => {
        console.log(commonOrgs);
        if(commonOrgs.length > 0 || id === user_id)
            {
                User.findOne({where: {userId: id}}).then(user => {
                    return res.status(200).send({
                        status: "success",
                        message: `Record of User with id ${id}`,
                        data: {
                            userId: user.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone
                        }
                    })
                }).catch(err => {
                    console.log(err);
                })
            }
            else{
                return res.status(403).send({
                    status: "Forbidden",
                    message: "Access to user's data denied",
                    statusCode: 403
                })
            }
    }).catch(err => {
        console.log(err);
    })

}

const getOrgs = (req, res, next) => {
    const user_id = req.user_id;
    let loggedUser;

    User.findOne({where: {userId: user_id}}).then(user => {
        loggedUser = user;
        return user.getOrganisations()
    }).then(organisations => {
        const orgs = organisations.map(org => {
            return {orgId: org.orgId, name: org.name, description: org.description}
        });
        return res.status(200).send({
            status: "success",
            message: `All ${loggedUser.firstName} organisations`,
            data: {
                organisations: orgs
            }
        })
    }).catch(err => {
        console.log(err);
    })
}

const getOrg = (req, res, next) => {
    const user_id = req.user_id;
    const orgId = req.params.orgId;

    let loggedUser;

    User.findOne({where: {userId: user_id}}).then(user => {
        loggedUser = user;
        return user.getOrganisations({where: {orgId: orgId}})
    }).then(([organisation]) => {
        if(!organisation)
            {
                return res.status(404).send({
                    status: "Not Found",
                    message: `User ${loggedUser.firstName} does not belong to the organisation with id ${orgId}`
                })
            }
        console.log(organisation.orgId);
        const org = {orgId: organisation.orgId, name: organisation.name, description: organisation.description}
        return res.status(200).send({
            status: "success",
            message: `Organisations with id ${orgId}`,
            data: org
        })
    }).catch(err => {
        console.log(err);
    })
}

const postOrg = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;

    if(!name || !description)
        {
            return res.status(400).send({
                status: "Bad Request",
                message: "Client error",
                statusCode: 400
            })
        }
    User.findOne({where: {userId: req.user_id}}).then(user => {
        return user.createOrganisation({orgId: generateRandomString(), name: name, description: description});
    }).then(org => {
        org = {orgId: org.orgId, name: org.name, description: org.description};
        return res.status(201).send({
            status: "success",
            message: "Organisation created successfully",
            data: org
        })
    }).catch(err => {
        console.log(err);
        return res.status(400).send({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        })
    })
}

const postAddUser = (req, res, next) => {
    const userId = req.body.userId;
    const orgId = req.params.orgId;
    let org;

    userOrganisation.findOne({where: {organisationOrgId: orgId, userUserId: req.user_id}}).then(organisation => {
        if(!organisation)
            {
                return res.status(400).send({
                    status: "Bad Request",
                    message: "User does not belong to this organisation",
                    statusCode: 400
                })
            }
        // org = organisation;
        User.findOne({where: {userId: userId}}).then(user => {
            if(!user)
                {
                    return res.status(404).send({
                        status: "Not Found",
                        message: "User does not exist",
                        statusCode: 404
                    })
                }
                console.log(org);
                userOrganisation.create({userUserId: userId, organisationOrgId: orgId}).then(result => {
                    console.log(result);
                    return res.status(200).send({
                        status: "success",
                        message: "User added to organisation successfully"
                    })
                })
        })
    }).catch(err => {
        console.log(err);
    })
}
module.exports = {
    getOrgs,
    getOrg,
    postOrg,
    postAddUser,
    getUser
}