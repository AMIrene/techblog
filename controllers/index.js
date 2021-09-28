const router = require('express').Router();

const dashboardRoutes = require('./dashboard-routes.js');
const homeRoutes = require('./home-routes');
const apiRoutes = require("./api")

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

//if error and above pages can't be found - throw error page

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;