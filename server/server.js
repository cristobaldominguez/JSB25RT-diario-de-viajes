import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import cors from 'cors'

// Config
import { PORT, UPLOADS_DIR } from './config.js'

// Import Routes
import usersRoutes from './routes/users_routes.js'
import entriesRoutes from './routes/entries_routes.js'

// Errors
import error404 from './middlewares/error404.js'
import errorMiddleware from './middlewares/error_middleware.js'
import serverListener from './helpers/server_listener.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('common'))
app.use(fileUpload())
app.use('/images', express.static(UPLOADS_DIR))

// Routes
app.use('/users', usersRoutes)
app.use('/entries', entriesRoutes)

// Error Handling
app.use(error404)
app.use(errorMiddleware)

app.listen(PORT, serverListener)
