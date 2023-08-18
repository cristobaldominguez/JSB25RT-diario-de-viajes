class CustomError extends Error {
  constructor ({ message, status = 500 }) {
    super(message)

    this.name = 'Error'
    this.status = status
    this.isAnError = true
  }

  toJson () {
    return {
      error: {
        name: this.name,
        status: this.status,
        message: this.message
      }
    }
  }
}

export default CustomError
