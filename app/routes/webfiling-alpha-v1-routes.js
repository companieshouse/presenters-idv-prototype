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
router.get('/prototype-webfiling/alpha/v1/sign-in', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/sign-in', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/sign-in-interrupt')
})


// ******* sign-in-interrupt javascript ********************************
router.get('/prototype-webfiling/alpha/v1/sign-in-interrupt', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/sign-in-interrupt', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/sign-in-interrupt', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/create-or-sign-in')
})


// ******* create-or-sign-in javascript ********************************
router.get('/prototype-webfiling/alpha/v1/create-or-sign-in', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/create-or-sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/create-or-sign-in', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/one-login-email')
})


// ******* one-login-email javascript ********************************
router.get('/prototype-webfiling/alpha/v1/one-login-email', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/one-login-email', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/one-login-email', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/one-login-password')
})


// ******* one-login-password javascript ********************************
router.get('/prototype-webfiling/alpha/v1/one-login-password', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/one-login-password', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/one-login-password', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/one-login-enter-code')
})


// ******* one-login-enter-code javascript ********************************
router.get('/prototype-webfiling/alpha/v1/one-login-enter-code', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/one-login-enter-code', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/one-login-enter-code', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/your-companies')
})


// ******* company-number javascript ********************************
router.get('/prototype-webfiling/alpha/v1/company-number', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/company-number', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/company-number', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/confirm-company')
})


// ******* confirm_company javascript ********************************
router.get('/prototype-webfiling/alpha/v1/confirm-company', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/confirm-company', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/confirm-company', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/auth-code')
})


// ******* auth-code javascript ********************************
router.get('/prototype-webfiling/alpha/v1/auth-code', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/auth-code', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/auth-code', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/new-company-added')
})


// ******* new-company-added javascript ********************************
router.get('/prototype-webfiling/alpha/v1/new-company-added', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/new-company-added', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/new-company-added', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/company-overview')
})


// ******* new-company-added javascript ********************************
router.get('/prototype-webfiling/alpha/v1/webfiling-presenter-type', function (req, res) {
  // Set URl
  res.render('prototype-webfiling/alpha/v1/webfiling-presenter-type', {
    currentUrl: req.originalUrl
  })
})

router.post('/prototype-webfiling/alpha/v1/webfiling-presenter-type', function (req, res) {
  res.redirect('/prototype-webfiling/alpha/v1/webfiling-presenter-statements')
})




