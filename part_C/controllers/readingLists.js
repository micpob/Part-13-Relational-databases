const router = require('express').Router()

const { ReadingList } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const user = await ReadingList.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

module.exports = router