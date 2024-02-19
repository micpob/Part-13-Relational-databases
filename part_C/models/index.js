const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
User.hasMany(ReadingList)
ReadingList.belongsTo(User)

Blog.belongsTo(User)
Blog.hasMany(ReadingList)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

module.exports = {
  Blog, User, ReadingList
}