const UserService = require('../services/user-service');
const { StatusCodes } = require('http-status-codes');

const userService = new UserService();

const signUp = async(req,res) => {
    try {
        const response = await userService.signUp({
            email: req.body.email,
            password: req.body.password
        });
        return res.status(StatusCodes.CREATED).json({
            data: response,
            success: true,
            message: 'Successfully Signed Up',
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explanation
        })
    }
}

const signIn = async(req,res) => {
    try {
        const response = await userService.signIn(req.body.email,req.body.password);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: 'Successfully Signed In',
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explanation
        });
    }
}

const isAuthenticated = async (req,res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticate(token);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: 'Authenticated User Successfully',
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explanation
        });
    }
}

const isAdmin = async (req,res) => {
    try {
        await userService.isAdmin(req.body.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully Authorized!',
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            err: error.explanation
        });
    }
}

module.exports = {
    signUp,
    signIn,
    isAuthenticated,
    isAdmin
}