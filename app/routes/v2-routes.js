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

  if (presenter === 'acsp') {
    return res.redirect('/V2/confirm-acsp-statements')
  }

  if (presenter === 'acspEmployee') {
    return res.redirect('/V2/confirm-acsp-employee-statements')
  }

  if (
    presenter === 'director' ||
    presenter === 'employeeCompany' ||
    presenter === 'employeeCorporate'
  ) {
    return res.redirect('/V2/confirm-officer-statements')
  }

  if (presenter === 'externalPresenter') {
    return res.redirect('/V2/confirm-external-presenter-statements')
  }

  if (presenter === 'insolvencyPractitioner') {
    return res.redirect('/V2/confirm-insolvency-practitioner-statements')
  }

  if (presenter === 'none') {
    return res.redirect('/V2/cannot-file')
  }

  res.redirect('/V2/what-type-of-presenter')
})


module.exports = router