const jwt = require('jsonwebtoken');

const UserRepository = require('../repository/user-repository');
const { JWT_KEY } = require('../config/serverConfig');
const bcrypt = require('bcrypt');
const { response } = require('express');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create (data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in Service layer");
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
                console.log("Password doesn't match");
                throw {error: 'Incorrect password'}
            }
            const newJWT = this.createToken({email: user.email,id:user.id});
            return newJWT;
        } catch (error) {
            console.log("Something went wrong during signin");
            throw error;
        }
    }

    createToken(user) {
        try {
            const result = jwt.sign(user,JWT_KEY, {expiresIn: '1h'});
            return result;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
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
            
        }
    }

    #checkPassword (userInputPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password checking");
            throw error;
        }
    }

}

module.exports = UserService;