const { StatusCodes } = require('http-status-codes');
const { User,Role } = require('../models/index');

const ClientErrors = require('../utils/client-error');
const ValidationError = require('../utils/validation-error');
const AppErrors = require('../utils/error-handler');

const CUSTOMER_ROLE_ID = 2;
class UserRepository {
    
    async create(data) {
        try {
            const user = await User.create(data);
            await user.addRole(CUSTOMER_ROLE_ID);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            else if(error.name == 'SequelizeUniqueConstraintError'){
                throw new AppErrors(
                    'ExistingUserError',
                    'User is already exist',
                    'Provided email already exist please login or signup using other email',
                    StatusCodes.OK
                );
            }
            throw new AppErrors();
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
            throw new AppErrors(
                "UserNotFound",
                "User doesn't exist",
                "Something went wrong",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
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
            return await user.hasRole(adminRole);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserRepository;