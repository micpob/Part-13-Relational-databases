const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionValidator } = require('../util/sessionValidator')

const readingListFinder = async (req, res, next) => {
  try {
    req.readingList = await ReadingList.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

router.post('/', async (req, res, next) => {
  try {
    const user = await ReadingList.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, sessionValidator, readingListFinder, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.validSession.userIdid)
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