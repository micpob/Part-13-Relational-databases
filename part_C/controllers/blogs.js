const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require("sequelize");
const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionValidator } = require('../util/sessionValidator')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%` 
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%` 
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})


router.post('/', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.validSession.userId)
    if (user.disabled) {
      return res.status(401).json({ error: 'This account is currently disabled' })
    } else {
      const blog = await Blog.create({...req.body, userId: user.id})
      return res.json(blog)
    }
  } catch(error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, sessionValidator, async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.validSession.userId)
    if (req.blog.userId === user.id) {
      const result = await req.blog.destroy();
      res.json(result)
    } else {
      return res.status(401).json({ error: 'User is not authorized to delete blog' })
    }
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)  
    } catch (error) {
      next(error)
    }
})


module.exports = router