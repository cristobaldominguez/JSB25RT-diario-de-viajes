import nodemailer from 'nodemailer'
import sendGridTransport from 'nodemailer-sendgrid'

import { SMTP_USER, SENDGRID_KEY } from '../config.js'

const transport = nodemailer.createTransport(
  sendGridTransport({
    apiKey: SENDGRID_KEY
  })
)

async function sendMail (email, subject, body) {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject,
      text: body
    }

    await transport.sendMail(mailOptions)
  } catch (error) {
    return error
  }
}

export default sendMail
