const router = require('express').Router();
const {User} = require('../../models');

//Get /api/users
router.get('/',(req, res) => {
    //access our user model and run .findAll() method
    //.findAll is reading the whole table from the database (Select * From users)
    User.findAll({
    //not getting the user's password
        attributes: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//Get /api/users/1
router.get('/:id', (req, res) => {
    //same as select * from users where id =1;
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData=>{
        if(!dbUserData){
            res.status(404).json({message: 'User not found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Post /api/users
router.post('/',(req, res) => {
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
/*INSERT INTO users
(username, email, password)
VALUES
("Lernantino", "lernantino@gmail.com", "password1234");
*/
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//make changes to /api/users/1
router.put('/:id', (req, res) => {
/* Same as:
UPDATE users
SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
WHERE id = 1;
*/ 
    User.update(req.body, {
        individualHooks: true,
        where: {
            id:req.params.id
        }
    })
    .then(dbUserData=>{
        if(!dbUserData[0]){
            res.status(404).json({message:'no user found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

//Delete /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id:req.params.id
        }
    })
    .then(dbUserData=>{
        if(!dbUserData){
            res.status(404).json({message: 'User not found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

module.exports = router;
