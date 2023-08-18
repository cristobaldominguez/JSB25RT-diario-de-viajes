import CustomError from './custom_error.js'

class AuthError extends CustomError {
  constructor ({ message, status = 403 }) {
    super({ message, status })

    this.name = 'AuthError'
  }
}

export default AuthError
