const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const { reg, login, logout, getCurrentUser, updateSubscription } = require('../../../controllers/users')
const { validateSignup, validateLogin, validateUpdateSubcription } = require('./validation')

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

module.exports = router
