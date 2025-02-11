const jwt = require('jsonwebtoken')
// const path = require('path')
const cloudinary = require('cloudinary').v2
const { promisify } = require('util')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
// const Upload = require('../services/upload-static')
const Upload = require('../services/upload-cloud')
// const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
const EmailService = require('../services/email')
const {
  CreateSenderSendgrid,
  // CreateSenderNodemailer
} = require('../services/sender-email')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

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
    const { email, subscription, avatarUrl, verifyToken } = newUser
    // TODO: send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid()
      )
      await emailService.sendVerifyPasswordEmail(verifyToken, email)
    } catch (err) {
      console.log(err.message)
    }
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
    const { subscription, avatarUrl, verify } = user

    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword || !verify) {
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
    // -----------КОД ДЛЯ СТАТИКИ-------------
    // const uploads = new Upload(AVATARS_OF_USERS)
    // const avatarUrl = await uploads.saveAvatarToStatic({
    //   idUser: id,
    //   pathFile: req.file.path,
    //   name: req.file.filename,
    //   oldFile: req.user.avatarUrl
    // })

    // -------------КОД ДЛЯ CLOUDINARY--------------
    const uploadCloud = promisify(cloudinary.uploader.upload)
    const uploads = new Upload(uploadCloud)
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(req.file.path, req.user.userIdImg)
    await Users.updateAvatar(id, avatarUrl, userIdImg)
    console.log(req.hostname)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl }
    })
  } catch (err) {
    next(err)
  }
}

// верификация
const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token)
    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful'
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found'
    })
  } catch (err) {
    next(err)
  }
}

// верификация повторно
const repeatVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email)
  if (user) {
    const { email, verifyToken, verify } = user
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendgrid()
        )
        await emailService.sendVerifyPasswordEmail(verifyToken, email)
        return res.json({
          status: 'success',
          code: HttpCode.OK,
          message: 'Verification email sent'
        })
      } catch (err) {
        console.log(err.message)
        return next(err)
      }
    } return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Verification has already been passed'
    })
  } return res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'User not found'
  })
}

module.exports = {
  reg,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  avatars,
  verify,
  repeatVerify
}
