import CustomError from './custom_error.js'

class AccessError extends CustomError {
  constructor ({ message, status = 403 }) {
    super({ message, status })

    this.name = 'AccessError'
  }
}

export default AccessError
