const express = require('express')
const router = express.Router()
const { reg, login, logout, getCurrentUser } = require('../../../controllers/users')
// const { validateAddContact, validateUpdateContact, validateUpdateStatus } = require('./validation')

// регистрация
router.post('/signup', reg)

// логин
router.post('/login', login)

// логаут
router.post('/logout', logout)

// данные текущего пользователя
router.get('/current', getCurrentUser)

module.exports = router
