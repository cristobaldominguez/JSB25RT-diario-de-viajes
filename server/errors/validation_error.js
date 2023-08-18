import CustomError from './custom_error.js'

class ValidationError extends CustomError {
  constructor ({ message, field, status = 403 }) {
    super({ message, status })

    this.name = 'ValidationError'
    this.field = field
  }

  toJson () {
    const obj = super.toJson()
    obj.error.field = this.field

    return obj
  }
}

export default ValidationError
