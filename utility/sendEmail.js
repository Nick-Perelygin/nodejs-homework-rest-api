const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const {SENGRID_API_KEY} = process.env

sgMail.setApiKey(SENGRID_API_KEY)

const sendmail = async (data) => {
    const email = {...data, from: 'bogdan.lyamzin.d@gmail.com'}
    await sgMail.send(email)
    return true
}

module.exports = sendmail