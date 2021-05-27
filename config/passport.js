const passport = require('passport')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
// const Users = require('../model/users')
// const { HttpCode } = require('../helpers/constants')

const { Strategy, ExtractJwt } = require('passport-jwt')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY
}

// opts.issuer = 'accounts.examplesoft.com'
// opts.audience = 'yoursite.net'
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({ id: jwt_payload.sub }, function(err, user) {
    if (err) {
      return done(err, false)
    }
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
      // or you could create a new account
    }
  })
}))
