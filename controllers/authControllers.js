const bcrypt = require('bcrypt')
const {userSchema} = require('../schemas');
const {User} = userSchema
const {HttpError, ctrlWrapper} = require('../utility');
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = process.env;

async function register (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email already in use')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({...req.body, password, hashPassword});
    res.status(201).json({
        email: newUser.email,
        name: newUser.name
    });
}

async function login (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, 'Email or password invalid')
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
        throw HttpError(401, 'Email or password invalid')
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '24h'})
    await User.findByIdAndUpdate(user._id, {token})
    res.status(201).json({
        token
    });
}

async function current (req, res) {
    const {email, name} = req.user;
    res.json({
        email,
        name,
    });
}

async function logout (req, res) {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ''})

    res.json({
        message: 'Logout success'
    });
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
}