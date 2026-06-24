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

router.post('/v2/chs/check-verification', (req, res) => {
  const haveVerified = req.body.haveVerified

  if (haveVerified === 'yes') {
    res.redirect('/V2/chs/verified-details')
  } else {
    res.redirect('/V2/chs/one-login-intro')
  }
})

// confirmation of presenter statements

router.post('/V2/presenter-type-radio', function(req, res) {

  const presenter = req.session.data['what-type-of-presenter']

  if (presenter === 'none') {
    return res.redirect('/V2/cannot-file')
  }

  return res.redirect('/V2/chs/confirm-presenter-statements')

})

module.exports = router