const { StatusCodes } = require('http-status-codes');
const { User,Role } = require('../models/index');

const ClientErrors = require('../utils/client-error');
const ValidationError = require('../utils/validation-error');

class UserRepository {
    
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            console.log("Something went wrong in Repository layer");
            throw error;
        }
    }

    async destroy(userId) {
        try {
            await User.destroy({
                where:{
                    id: userId
                }
            });
            return true;
        } catch (error) {
            console.log("Something went wrong in Repository layer");
            throw error;
        }
    }
    async getUserById (userId) {
        try {
            const user = await User.findByPk(userId,{
                attributes: ['email', 'id']
            });
            return user;
        } catch (error) {
            console.log("Something went wrong in Repository layer");
            throw error;
        }
    }

    async getUserByEmail (userEmail) {
        try {
            const user = await User.findOne({
                where: {
                    email: userEmail
                }
            });
            if(!user) {
                throw new ClientErrors(
                    'EmailNotFound',
                    'Invalid email sent in request',
                    'Please Check the email provided, as there is no record of the email',
                    StatusCodes.NOT_FOUND
                );
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async isAdmin (userId) {
        try {
            const user = await User.findByPk(userId);
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } catch (error) {
            
        }
    }
}

module.exports = UserRepository;