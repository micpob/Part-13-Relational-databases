const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user) {
    return response.status(401).json({
      error: 'no user with this username found'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'this account is currently disabled'
    })
  }

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  const session = await Session.create({token: token, userId: user.id})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router