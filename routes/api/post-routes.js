const router = require('express').Router();
//including user because we need to know the user who posts it
const {Post,User, Vote} = require('../../models');
const { post } = require('./user-routes');
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

router.post('/',(req, res) =>{
    //expects{title:, post_url, user_id:}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT  /api/posts/upvote
// need to before the /:id put route or express will think the upvote is a parameter of the /:id
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
      })
        .then(() => {
            //then find the post we just voted on
            return Post.findOne({
                where: {
                    id: req.body.post_id
                },
                attributes: ['id', 'post_url', 'title', 'created_at',
                        [
                            //literal allows us to run regular SQL queries from within sequelize
                            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                            'vote_count'
                        ]
                    ]
            })
            .then(dbPostData => res.json(dbPostData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        });      
}); 


router.put('/:id',(req, res)=>{
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

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData=>{
        if(!dbPostData) {
            res.status(404).json({message:'No post found!'});
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