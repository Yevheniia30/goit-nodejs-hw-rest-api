const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
const { reg, login, logout, getCurrentUser, updateSubscription, avatars, verify, repeatVerify } = require('../../../controllers/users')
const { validateSignup, validateLogin, validateUpdateSubcription } = require('./validation')

// верификация
router.get('/verify/:token', verify)

// повторная верификация
router.post('/verify', repeatVerify)

// регистрация
router.post('/signup', validateSignup, reg)

// логин
router.post('/login', validateLogin, login)

// логаут
router.post('/logout', guard, logout)

// данные текущего пользователя
router.get('/current', guard, getCurrentUser)

// обновление подписки
router.patch('/', guard, validateUpdateSubcription, updateSubscription)

// аватар
router.patch('/avatars', [guard, upload.single('avatar')], avatars)

module.exports = router
