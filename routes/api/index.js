const router = require('express').Router();
const userRoutes = require('./user-routes');

router.use('/users',userRoutes);
//router.use('/books', bookRoutes);
module.exports = router;