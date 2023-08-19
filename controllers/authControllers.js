const bcrypt = require('bcrypt')
const {userSchema} = require('../schemas');
const {User} = userSchema
const {HttpError, ctrlWrapper, sendEmail} = require('../utility');
const jwt = require('jsonwebtoken')
const {SECRET_KEY, BASE_URL} = process.env;
const gravatar = require('gravatar')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')
const {nanoid} = require('nanoid')

async function register (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email already in use')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const avatarUrl = gravatar.url(email)
    const verificationCode = nanoid()
    const newUser = await User.create({...req.body, password: hashPassword, avatarUrl});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>` 
    }
    await sendEmail(verifyEmail)
    res.status(201).json({
        email: newUser.email,
        name: newUser.name
    });
}

async function verifyEmail (req, res) {
    const{verificationCode} = req.params
    const user = await User.findOne({verificationCode})
    if(!user){
        throw HttpError(401, 'Email not found')
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ''})
    res.json({
        message: 'Email verufy success'
    })
}

async function login (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, 'Email or password invalid')
    }
    if(!user.verify){
        throw HttpError(401, 'Email not verified')
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
    const jimpAvatarUrl = Jimp.read(avatarUrl, (err, lenna) => {
        if (err) 
        throw HttpError(404, 'Not found image');
        lenna
          .resize(250, 250)
          .quality(60) 
          .greyscale() 
          .write(`${avatarUrl}-small-bw.jpg`);
      });
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
    verifyEmail: ctrlWrapper(verifyEmail),
}