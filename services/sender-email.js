const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
// const config = require('../config/config')

require('dotenv').config()

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    // const msg = {
    //   to: 'test@example.com',
    //   from: 'test@example.com',
    //   subject: 'Sending with SendGrid is Fun',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // }

    return await sgMail.send({ ...msg, from: 'suskagoit@ex.ua' })
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'suskagoit@meta.ua',
        pass: process.env.PASSWORD,
      },
    }

    const transporter = nodemailer.createTransport(config)
    const emailOptions = {
      from: 'suskagoit@meta.ua',
      ...msg
    //   to: 'noresponse@gmail.com',
    //   subject: 'Nodemailer test',
    //   text: 'Привет. Мы тестируем отправку писем!',
    }

    return await transporter.sendMail(emailOptions)
  }
}

module.exports = { CreateSenderSendgrid, CreateSenderNodemailer }
