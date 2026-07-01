// app/routes.js
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// version controlled routes

router.use('/', require('./routes/v1-routes.js'));
router.use('/', require('./routes/v2-routes.js'));

module.exports = router