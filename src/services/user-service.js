const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppErrors = require('../utils/error-handler');
const UserRepository = require('../repository/user-repository');

const { JWT_KEY } = require('../config/serverConfig');
const { ServerErrorCodes } = require('../utils/error-codes');
const { StatusCodes } = require('http-status-codes');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp (data) {
        try {
            const user = await this.userRepository.create(data);
            const newJWT = await this.createToken({email: user.email,id:user.id});
            return newJWT;
        } catch (error) {
            throw error;
        }
    }

    async signIn (email,plainPassword) {
        try {
            /**
             * Step 1 => Fetch the user using email
             * Step 2 => Compare incoming plain password with stores encrypted password
             */
            const user = await this.userRepository.getUserByEmail(email);
            const matchPassword = this.#checkPassword(plainPassword,user.password);
            if(!matchPassword){
                throw new AppErrors(
                    'EmailNotFound',
                    'Please check your email & password',
                    "User doesn't exist with the given email & password",
                    StatusCodes.NOT_FOUND
                );
            }
            const newJWT = this.createToken({email: user.email,id:user.id});
            return newJWT;
        } catch (error) {
            if(error.name == 'EmailNotFound'){
                throw error;
            }
            throw error;
        }
    }

    async createToken(user) {
        try {
            const result = jwt.sign(user,JWT_KEY, {expiresIn: '1h'});
            return result;
        } catch (error) {
            throw new AppErrors(
                'TokenIssue',
                "Token creation failed",
                "Something went wrong",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            throw new AppErrors(
                'TokenIssue',
                "Invalid Token",
                "Please check your Access Token",
                StatusCodes.BAD_REQUEST
            );
        }
    }

    async isAuthenticate (token) {
        try {
            const response = this.verifyToken(token);
            if(!response){
                throw {error: 'Invalid Token'}
            }
            const user = await this.userRepository.getUserById(response.id);
            if(!user){
                throw {error: 'Invalid User'}
            }
            return user.id;
        } catch (error) {
            throw error;
        }
    }

    #checkPassword (userInputPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPassword, encryptedPassword);
        } catch (error) {
            throw error;
        }
    }

    async isAdmin(userId){
        try {
            const response = await this.userRepository.isAdmin(userId);
            if(!response){
                throw new AppErrors(
                    "AuthorizationIssue",
                    "Not Authorized",
                    "User is not authorized as Admin",
                    StatusCodes.UNAUTHORIZED
                );
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserService;