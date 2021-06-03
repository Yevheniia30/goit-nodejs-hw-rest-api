const jwt = require('jsonwebtoken')
// const path = require('path')
// const cloudinary = require('cloudinary').v2
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
const Upload = require('../services/upload-static')
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
// const AVATARS_OF_USERS = path.join(process.env.AVATARS_OF_USERS, 'avatars')

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
    const { email, subscription, avatarUrl } = newUser
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { user: { email, subscription, avatarUrl } }
    })
  } catch (err) {
    next(err)
  }
}

// логин
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const { subscription, avatarUrl } = user

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
      data: { token, user: { email, subscription, avatarUrl } }
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
    const { email, subscription, avatarUrl } = req.user
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
      data: { email, subscription, avatarUrl }
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

// обновление аватара
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const uploads = new Upload(AVATARS_OF_USERS)
    const url = await uploads.saveAvatarToStatic({

      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarUrl
    })
    await Users.updateAvatar(id, url)
    console.log(req.hostname)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { url }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  reg,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  avatars
}
