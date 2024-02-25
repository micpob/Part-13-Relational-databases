const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionValidator } = require('../util/sessionValidator')

router.delete('/:id', tokenExtractor, sessionValidator, async (req, res) => {
  if (req.params.id) {
    if (req.validSession.userId !== parseInt(req.params.id)) {
      return res.status(401).json({ error: 'Unauthorized account' })
    } else {
      const result = await Session.destroy({
        where: {
          userId: req.params.id
        },
      })
      res.json(result)
    }
  } else {
    res.status(404).end()
  }
})

module.exports = router