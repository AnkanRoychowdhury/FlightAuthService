const validateUserAuth = (req,res,next) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            data: {},
            success: false,
            message: 'Please Check your email & password',
            err: 'Email or password missing in the request'
        })
    }
    next();
}

const validateIsAdminRequest = (req,res,next) => {
    if(!req.body.id){
        return res.status(400).json({
            data: {},
            success: false,
            message: 'User id not given',
            err: 'Not Authorized'
        })
    }
    next();
}

module.exports = {
    validateUserAuth,
    validateIsAdminRequest
}