const bcrypt = require('bcrypt')
const {userSchema} = require('../schemas');
const {User} = userSchema
const {HttpError, ctrlWrapper} = require('../utility');
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = process.env;
const gravatar = require('gravatar')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')

async function register (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email already in use')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const avatarUrl = gravatar.url(email)
    const newUser = await User.create({...req.body, password: hashPassword, avatarUrl});
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
    const passwordCompare = bcrypt.compare(password, user.password)
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

async function updateAvatar (req, res) {
    const{_id} = req.user
    const {path: tempUpload, originalname} = req.file;
    const fileName = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsDir, fileName)
    await fs.rename(tempUpload, resultUpload)
    const avatarUrl = path.join('avatars', fileName)
    const jimpAvatarUrl = Jimp.read(avatarUrl).resize(250, 250)
    await User.findByIdAndUpdate(_id, {jimpAvatarUrl})

    res.json({
        avatarUrl
    });
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}