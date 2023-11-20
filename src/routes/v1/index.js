const express = require('express');
const UserController = require('../../controller/user-controller');
const { AuthRequestValidators } = require('../../middlewares/index');

const router = express.Router();

router.post('/signup',AuthRequestValidators.validateUserAuth, UserController.signUp);
router.post('/signin',AuthRequestValidators.validateUserAuth, UserController.signIn);

router.get('/authenticates',UserController.isAuthenticated);
router.get('/isAdmin',AuthRequestValidators.validateIsAdminRequest, UserController.isAdmin);

module.exports = router;