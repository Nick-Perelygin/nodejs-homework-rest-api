const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/authControllers')
const {validateBody, authenticate, upload} = require('../../middleware')
const {userSchema} = require('../../schemas')
const {schemas} = userSchema

router.post('/register', validateBody(schemas.registerSchema), ctrl.register)

router.post('/login', validateBody(schemas.loginSchema), ctrl.login)

router.get('/current', authenticate, ctrl.current)

router.post('/logout', authenticate, ctrl.logout)

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar)

module.exports = router