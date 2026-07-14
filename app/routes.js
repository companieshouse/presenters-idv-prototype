// app/routes.js
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// version controlled routes

router.use('/', require('./routes/v1-routes.js'));

// chs routes
router.use('/', require('./routes/chs-alpha-v1-routes.js'));


// web filing routes
router.use('/', require('./routes/webfiling-alpha-v1-routes.js'));

module.exports = router