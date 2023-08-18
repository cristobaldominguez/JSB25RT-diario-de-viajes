import { PORT } from '../config.js'

const validationCode = ({ username, registrationCode }) => (`¡Bienvenid@ ${username}!
Por favor verifica el usuario a través de la dirección: http://localhost:${PORT}/users/validate/${registrationCode}`)

export default validationCode
