import express from 'express'
import morgan from 'morgan'

// Config
import { PORT } from './config.js'

const app = express()

// Middlewares
app.use(morgan('common'))

app.listen(
  PORT,
  () => console.log(`Server running at: http://localhost:${PORT}\n` +
                    'Press Ctrl-C to terminate.')
)
