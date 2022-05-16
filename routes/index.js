const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req,res) => {
    //a 404 error that we request an endpoint that doesn't exist'
    res.status(404).end();
});

module.exports = router;