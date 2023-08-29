import colors from 'picocolors'

function errorMiddleware (err, req, res, next) {
  // Error Logging
  console.error(colors.red(`❌ ${err.message}`))

  if (err.isAnError) {
    return res.status(err.status).json(err.toJson())
  }

  res.status(500)
  res.json({
    error: {
      status: 500,
      name: 'UnknownError',
      message: 'Error no conocido'
    }
  })
}

export default errorMiddleware
