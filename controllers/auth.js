const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if(req.body.type == 'REGIST') {
        try {
            const id = req.body.id;
            const pw = req.body.password;
            const email = req.body.email;
    
            const existedUser = await User.findOne({ID: id});
            if(existedUser) {
                throw new Error('ID exists already.');
            }

            const hashedPassword = await bcrypt.hashSync(pw);

            const user = new User({
                ID: id,
                Password: hashedPassword,
                Email: email
            });
            
            return res.status(200).json(await user.save());
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
                throw new Error('ID not exists.');
            }

            const isEqual = await bcrypt.compareSync(pw, user.Password);
            if(!isEqual) {
                throw new Error('Password is incorrect.');
            }
    
            const token = jwt.sign({userId: user.id, userEmail: user.Email}, 'somesupersecretkey', {
                expiresIn: '1h',
            });
    
            return res.status(200).json({token: 'bearer ' + token});
        }
        catch(err) {
            throw err;
        }
    }
}