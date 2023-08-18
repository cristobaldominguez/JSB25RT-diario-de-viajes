import { PORT } from '../config.js'

const serverListener = () => console.log(`Server running at: http://localhost:${PORT}\n` +
'Press Ctrl-C to terminate.')

export default serverListener
