// const { options } = require('joi')
// const { token } = require('morgan')
const User = require('./schemas/user')

// найти по id (логаут)
const findById = async (id) => {
  return await User.findOne({ _id: id })
}

// найти по email (логин)
const findByEmail = async (email) => {
  return await User.findOne({ email })
}

// создать (регистрация пользователя)
const create = async (options) => {
  const user = new User(options)
  return await user.save()
}

// получение токена
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

module.exports = {
  findById, findByEmail, create, updateToken
}
