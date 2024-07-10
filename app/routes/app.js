const express = require('express');

const appControllers = require('../controllers/app');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.get('/api/users/:id',authControllers.protectedRoute, appControllers.getUser);
router.get('/api/organisations', authControllers.protectedRoute, appControllers.getOrgs);
router.get('/api/organisations/:orgId', authControllers.protectedRoute, appControllers.getOrg);
router.post('/api/organisations', authControllers.protectedRoute, appControllers.postOrg);
router.post('/api/organisations/:orgId/users', authControllers.protectedRoute, appControllers.postAddUser);

module.exports = router
