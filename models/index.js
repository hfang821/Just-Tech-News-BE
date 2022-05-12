const User = require('./User');
const Post = require('./Post');

//One-too-many relationships: a user can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//reverse(one-to-one relationship): a post only belongs to one user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = {User,Post};