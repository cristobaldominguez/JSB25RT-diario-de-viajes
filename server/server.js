import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'

// Config
import { PORT, UPLOADS_DIR } from './config.js'

// Import Routes
import userRoutes from './routes/users_routes.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('common'))
app.use(fileUpload())
app.use('/avatars', express.static(UPLOADS_DIR))

// Routes
app.use('/users', userRoutes)

app.listen(
  PORT,
  () => console.log(`Server running at: http://localhost:${PORT}\n` +
                    'Press Ctrl-C to terminate.')
)
