import express from 'express'
import morgan from 'morgan'

// Config
import { PORT } from './config.js'

// Import Routes
import userRoutes from './routes/users_routes.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('common'))

// Routes
app.use('/users', userRoutes)

app.listen(
  PORT,
  () => console.log(`Server running at: http://localhost:${PORT}\n` +
                    'Press Ctrl-C to terminate.')
)
