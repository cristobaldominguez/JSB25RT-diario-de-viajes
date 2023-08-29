import { t } from 'i18next'

import CustomError from './custom_error.js'

class UnknownError extends CustomError {
  constructor () {
    super({ message: t('errors.unknown') })

    this.name = 'UnknownError'
  }
}

export default UnknownError
