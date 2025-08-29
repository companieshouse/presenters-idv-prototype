// app/routes.js
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Log requests + session data (handy while debugging)
router.use((req, res, next) => {
  const log = {
    method: req.method,
    url: req.originalUrl,
    data: req.session?.data || {}
  }
  console.log(JSON.stringify(log, null, 2))
  next()
})

// version controlled routes

router.use('/', require('./routes/v1-routes.js'));


module.exports = router