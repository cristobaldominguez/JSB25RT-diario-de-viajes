import crypto from 'node:crypto'

function numberGenerator ({ length }) {
  return parseInt(Array.from({ length }, (v, i) => i === 0 ? 1 : 0).join(''))
}

function randomDigits ({ number = 9 }) {
  const init = numberGenerator({ length: number })
  const last = numberGenerator({ length: number + 1 })
  return crypto.randomInt(init, last).toString()
}

export default randomDigits
