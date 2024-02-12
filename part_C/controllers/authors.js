const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { Blog, User, Author } = require('../models')
const { Op } = require("sequelize");
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: ['author', 
    [sequelize.fn('COUNT', sequelize.col('id')), 'articles'], 
    [sequelize.fn('SUM', sequelize.col('likes')), 'likes'], 
  ],
    group: ['author']
  })
  res.json(authors)
})

module.exports = router