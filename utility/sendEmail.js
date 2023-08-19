const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const {SENGRID_API_KEY} = process.env

sgMail.setApiKey(SENGRID_API_KEY)

const sendmail = async (data) => {
    const email = {...data, from: '77kalian77@gmail.com'}
    await sgMail.send(email)
    return true
}

module.exports = sendmail