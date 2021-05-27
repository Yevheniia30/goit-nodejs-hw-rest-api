const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')

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
        message: 'Email or password is wrong'
      })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1w' })
    await Users.updateToken(user.id, token)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { token, user: { email, subscription } }
    })
  } catch (err) {
    next(err)
  }
}

// логаут
const logout = async (req, res, next) => { }

// данные текущего пользователя
const getCurrentUser = async (req, res, next) => { }

module.exports = {
  reg, login, logout, getCurrentUser
}
