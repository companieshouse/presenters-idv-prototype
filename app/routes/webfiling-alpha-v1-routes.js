// @ts-nocheck
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

module.exports = router;

// Show session data and URLs in the terminal  
router.use((req, res, next) => {  
  const log = {  
    method: req.method,  
    url: req.originalUrl,  
    data: req.session.data  
  }  
  console.log(JSON.stringify(log, null, 2))  
  next()  
}) 


// ******* Sign-in javascript ********************************
router.get('/webfiling/alpha/v1/sign-in', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/sign-in', function (req, res) {
  res.redirect('/webfiling/alpha/v1/sign-in-interrupt')
})


// ******* sign-in-interrupt javascript ********************************
router.get('/webfiling/alpha/v1/sign-in-interrupt', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/sign-in-interrupt', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/sign-in-interrupt', function (req, res) {
  res.redirect('/webfiling/alpha/v1/create-or-sign-in')
})


// ******* create-or-sign-in javascript ********************************
router.get('/webfiling/alpha/v1/create-or-sign-in', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/create-or-sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/create-or-sign-in', function (req, res) {
  res.redirect('/webfiling/alpha/v1/one-login-email')
})


// ******* one-login-email javascript ********************************
router.get('/webfiling/alpha/v1/one-login-email', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/one-login-email', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/one-login-email', function (req, res) {
  res.redirect('/webfiling/alpha/v1/one-login-password')
})


// ******* one-login-password javascript ********************************
router.get('/webfiling/alpha/v1/one-login-password', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/one-login-password', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/one-login-password', function (req, res) {
  res.redirect('/webfiling/alpha/v1/one-login-enter-code')
})


// ******* one-login-enter-code javascript ********************************
router.get('/webfiling/alpha/v1/one-login-enter-code', function (req, res) {
  // Set URl
  res.render('webfiling/alpha/v1/one-login-enter-code', {
    currentUrl: req.originalUrl
  })
})

router.post('/webfiling/alpha/v1/one-login-enter-code', function (req, res) {
  res.redirect('/webfiling/alpha/v1/your-companies')
})




