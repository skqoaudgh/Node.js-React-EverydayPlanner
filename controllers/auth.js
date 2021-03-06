const User = require('../models/user');
const jwt = require('jsonwebtoken');

const rsa = require('../key/key');

module.exports = async (req, res, next) => {
    if(req.body.type == 'REGIST') {
        try {
            const id = req.body.id;
            const pw = req.body.password;
            const email = req.body.email;
    
            const existedUser = await User.findOne({ID: id});
            if(existedUser) {
                return res.status(200).json({error: 'ID'});
            }

            const existedEmail = await User.findOne({Email: email});
            if(existedEmail) {
                return res.status(200).json({error: 'Email'});
            }

            const hashedPassword = rsa.encrypt(pw);

            const user = new User({
                ID: id,
                Password: hashedPassword,
                Email: email
            });
            
            return res.status(201).json(await user.save());
        }
        catch(err) {
            throw err;
        }
    }

    else if(req.body.type == 'LOGIN') {
        try {
            const id = req.body.id;
            const pw = req.body.password;
    
            const user = await User.findOne({ID: id});
            if(!user) {
                return res.status(200).json({error: 'LoginFail'});
            }

            const isEqual = (rsa.decrypt(user.Password) == pw)?true:false;
            if(!isEqual) {
                return res.status(200).json({error: 'LoginFail'});
            }
    
            const token = jwt.sign({userId: user.id, userEmail: user.Email}, 'somesupersecretkey', {
                expiresIn: '24h',
            });
    
            return res.status(200).json({userId: user.id, token: 'bearer ' + token});
        }
        catch(err) {
            throw err;
        }
    }
}