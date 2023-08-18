import CustomError from './custom_error.js'

class ContentError extends CustomError {
  constructor ({ message, status = 403 }) {
    super({ message, status })

    this.name = 'ContentError'
  }
}

export default ContentError
