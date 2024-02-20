const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { ReadingList, User } = require('../models')

const readingListFinder = async (req, res, next) => {
  try {
    req.readingList = await ReadingList.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', async (req, res, next) => {
  try {
    const user = await ReadingList.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, readingListFinder, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.readingList.userId === user.id) {
      req.readingList.read = req.body.read
      await req.readingList.save()
      res.json(req.readingList) 
    } else {
      return res.status(401).json({ error: 'User is not authorized to change read status' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router