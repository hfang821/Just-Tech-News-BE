const router = require('express').Router();
//including user because we need to know the user who posts it
const {Post,User, Vote, Comment} = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

//get all users
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({  
        attributes: ['id','post_url','title', 'created_at',
        [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'), 'vote_count'
        ]],
        //sort the posts based on the created_at attribute
        order: [['created_at','DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },

            {
                //the json response will contain the username attribute
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res)=>{
    Post.findOne({
        where: {
            id:req.params.id
        },

        attributes: 
        [
            'id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],

        include: [
            {
                
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
                
            },

            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData =>{
        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id.'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) =>{
    //expects{title:, post_url, user_id:}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT  /api/posts/upvote
// need to before the /:id put route or express will think the upvote is a parameter of the /:id
router.put('/upvote', withAuth, (req, res) => {
    //making sure the session exists (upvote won't work if the user is not logged in, session does not exist)
    if(req.session){
        //pass session id along with all destructured properties on req.body
        //... (three dots in Javascript) is called the Spread Syntax or Spread Operator. 
        //This allows an iterable such as an array expression or string to be expanded or an object expression to be expanded wherever placed.
        Post.upvote({...req.body, user_id: req.session.user_id},{Vote, Comment, User})
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
}); 


router.put('/:id', withAuth,(req, res)=>{
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {id: req.params.id}
        }
        )
        .then(dbPostData => {
            if(!dbPostData){
                res.status(404).json({message: 'No post found'});
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, (req, res) => {
    console.log('id', req.params.id);
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });



module.exports = router;