const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log('AUTHORIZATION:', authorization)
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

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})


router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
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

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    const result = await req.blog.destroy();
    res.json(result)
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