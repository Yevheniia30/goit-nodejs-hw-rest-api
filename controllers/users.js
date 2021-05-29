const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
// const User = require('../model/schemas/user')

// регистрация
const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used'
      })
    }
    const newUser = await Users.create(req.body)
    const { email, subscription } = newUser
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { user: { email, subscription } }
    })
  } catch (err) {
    next(err)
  }
}

// логин
const login = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNATHORIZED).json({
        status: 'error',
        code: HttpCode.UNATHORIZED,
        message: 'Not authorized'
      })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1w' })
    await Users.updateToken(user.id, token)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { token, user: { subscription, email } }
    })
  } catch (err) {
    next(err)
  }
}

// логаут
const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id, null)
    if (!req.user) {
      return res.status(HttpCode.UNATHORIZED).json({
        status: 'error',
        code: HttpCode.UNATHORIZED,
        message: 'Not authorized'
      })
    }
    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (err) {
    next(err)
  }
}

// данные текущего пользователя
const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user
    const currentUser = await Users.findByEmail(email)
    if (!currentUser) {
      return res.status(HttpCode.UNATHORIZED).json({
        status: 'error',
        code: HttpCode.UNATHORIZED,
        message: 'Not authorized'
      })
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { email, subscription }
    })
  } catch (err) {
    next(err)
  }
}

// обновление подписки
const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user
    const user = await Users.updateUserSubscription(id, req.body)
    const { email, subscription } = user
    if (user) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { email, subscription }
      })
    }
    return res.status(HttpCode.UNATHORIZED).json({
      status: 'error',
      code: HttpCode.UNATHORIZED,
      message: 'Not authorized'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  reg, login, logout, getCurrentUser, updateSubscription
}
