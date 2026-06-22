// @ts-nocheck
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.post('/V2/chs/check-verification', (req, res) => {
  const haveVerified = req.body.haveVerified

  if (haveVerified === 'yes') {
    res.redirect('/V2/chs/verified-details')
  } else {
    res.redirect('/V2/chs/one-login-intro')
  }
})

// also accept lowercase path if your form/action uses /v2/...
router.post('/v2/chs/check-verification', (req, res) => {
  const haveVerified = req.body.haveVerified

  if (haveVerified === 'yes') {
    res.redirect('/V2/chs/verified-details')
  } else {
    res.redirect('/V2/chs/one-login-intro')
  }
})

module.exports = router