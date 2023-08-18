import 'dotenv/config'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = process.env.PORT || 3000
const root = dirname(fileURLToPath(import.meta.url))
const maxImageSize = 1024

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  SMTP_USER,
  SENDGRID_KEY,
  SECRET,
  UPLOADS_DIR
} = process.env

export {
  root,
  PORT,
  maxImageSize,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  SMTP_USER,
  SENDGRID_KEY,
  SECRET,
  UPLOADS_DIR
}
