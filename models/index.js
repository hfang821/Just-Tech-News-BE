const User = require('./User');
const Post = require('./Post');
const Vote = require('./vote');
const Comment = require('./Comment');

//One-too-many relationships: a user can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//reverse(one-to-one relationship): a post only belongs to one user//
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

//User and Post models will be connected but through the Vote model. (foreign key will be in Vote)
User.belongsToMany(Post,{
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User,{
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = {User,Post,Vote, Comment};