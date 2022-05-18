const router = require('express').Router();
const homeRoutes = require('./home-routes.js');

const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

router.use((req,res) => {
    //a 404 error that we request an endpoint that doesn't exist'
    res.status(404).end();
});

module.exports = router;