const passport = require('passport')

const guard = (req, res, next) => {
  console.log('Authentication')
  next()
}

module.exports = guard
