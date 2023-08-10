import bcrypt from 'bcrypt'

async function encryptPassword ({ password }) {
  const salt = bcrypt.genSaltSync(12)
  return await bcrypt.hash(password, salt)
}

export default encryptPassword
