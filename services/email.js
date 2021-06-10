const Mailgen = require('mailgen')
// require('dotenv').config()

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = 'link for production'
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
    }

    #createTemplateVerifyEmail(token, name) {
        const mailGenerator = new Mailgen({
    theme: 'neopolitan',
    product: {
        // Appears in header & footer of e-mails
        name: 'System Contacts',
        link: this.link
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
        })
        const email = {
    body: {
        name: 'Guest',
        intro: 'Welcome to System Contacts! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with System Contacts, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: `${this.link}/api/users/verify/${token}`
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

// Generate an HTML email with the provided contents
return mailGenerator.generate(email);
    }

    async sendVerifyPasswordEmail(token, email, name) {
        const emailBody = this.#createTemplateVerifyEmail(token, name)
        const result = await this.sender.send({
            to: email,
            subject: 'Verify your account',
            html: emailBody
        })
        console.log(result);
    }
}

module.exports = EmailService
