const { Session } = require('../models')

const sessionValidator = async (req, res, next) => {
  const providedSessionCredentials = req.providedSessionCredentials
  if (providedSessionCredentials) {
      const validSession = await Session.findOne({ where: { userId: providedSessionCredentials.userId, token: providedSessionCredentials.token } })
      if (validSession) {
        req.validSession = validSession
      } else {
        return res.status(401).json({ error: 'session invalid' })
      }
  }  else {
    return res.status(401).json({ error: 'credentials missing' })
  }
  next()
}

module.exports = { sessionValidator }