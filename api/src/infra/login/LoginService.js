const UserModel = require('../../modules/Users/UserModel');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_EXPIRES_IN  } = process.env;


exports.login = async (username, password) => {

    const user = await UserModel.findOne({ username, password });
    
    if (user) {
        let payload = {
            _id: user._id,
            username: user.username,
            name: user.name
        };
        
        if (user.companies.length > 1) {
            payload.companies = user.companies;
        } else {
            payload.company = user.companies[0];
        }

        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
        
    throw new Error('Invalid username or password.');
};

exports.logInCompany = async (req, res) => {
    
};
