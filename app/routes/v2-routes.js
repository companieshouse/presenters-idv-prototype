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
router.get('/chs/alpha/v1/sign-in', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/sign-in', function (req, res) {
  // Create empty array and set error variables to false
  var errors = []

  if (req.session.data['email'] === '') {
    errors.push({
      text: 'Enter your email address',
      href: '#email'
    })
    
    res.render('chs/alpha/v1/sign-in', {
      errorEmail: true,
      errorList: errors
    })
  } else {
      res.redirect('/chs/alpha/v1/search-signed-in')
    }
})


// ******* authcode javascript ********************************
router.get('/chs/alpha/v1/auth-code', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/auth-code', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/auth-code', function (req, res) {
  // Create empty array and set error variables to false
  var errors = []

  if (req.session.data['authCode'] === '') {
    errors.push({
      text: 'Enter the authentication code',
      href: '#authCode'
    })
    
    res.render('chs/alpha/v1/auth-code', {
      errorAuthcode: true,
      errorList: errors
    })
  } else {
      res.redirect('/chs/alpha/v1/chs-file-accounts')
    }
})



// ******* presenter-type-radio javascript ********************************
router.get('/chs/alpha/v1/presenter-type-radio', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/presenter-type-radio', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/presenter-type-radio', function (req, res) {
  // Create empty array
  var errors = []

  // Check if user has filled out a value
  if (typeof req.session.data['presenterType'] === 'undefined') {
    // No value so add error to array
    errors.push({
      text: 'Select what type of presenter you are',
      href: '#presenterType'
    })

    // Re-show page with error value as true so errors will show
    res.render('chs/alpha/v1/presenter-type-radio', {
      errorPresenterType: true,
      errorList: errors
    })
  } else {
    if (req.session.data['presenterType'] === 'none') {
      res.redirect('/chs/alpha/v1/cannot-file')
    } 
    else if (req.session.data['authCode'] === '123456') {
      res.redirect('/chs/alpha/v1/have-you-verified')
    } 
    else {
      // User inputted value so move to next page
      res.redirect('/chs/alpha/v1/confirm-presenter-statements')
    }
  }
})


// ******* confirm-presenter-statements javascript ********************************
router.get('/chs/alpha/v1/confirm-presenter-statements', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/confirm-presenter-statements', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/confirm-presenter-statements', function (req, res) {
  // Create empty array
  var errors = []

  if (typeof req.session.data['statements'] === 'undefined') {
    // No value so add error to array
    errors.push({
      text: 'Select the statements',
      href: '#statements'
    })

    // Re-show page with error value as true so errors will show
    res.render('chs/alpha/v1/confirm-presenter-statements', {
      errorStatements: true,
      errorList: errors
    })
  } else {
      res.redirect('/chs/alpha/v1/change-address')
  }
})


// ******* have-you-verified javascript ********************************
router.get('/chs/alpha/v1/have-you-verified', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/have-you-verified', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/have-you-verified', function (req, res) {
  // Create empty array
  var errors = []

  // Check if user has filled out a value
  if (typeof req.session.data['haveVerified'] === 'undefined') {
    // No value so add error to array
    errors.push({
      text: 'Select yes if you have verified your identity with Companies House',
      href: '#haveVerified'
    })

    // Re-show page with error value as true so errors will show
    res.render('chs/alpha/v1/have-you-verified', {
      errorHaveVerified: true,
      errorList: errors
    })
  } else {
    if (req.session.data['haveVerified'] === 'yes') {
      res.redirect('/chs/alpha/v1/verified-details')
    } else {
      // User inputted value so move to next page
      res.redirect('/chs/alpha/v1/verify-your-identity')
    }
  }
})



// ******* verified-details javascript ******************************
router.get('/chs/alpha/v1/verified-details', function (req, res) {
  // Set URl
  res.render('chs/alpha/v1/verified-details', {
    currentUrl: req.originalUrl
  })
})

router.post('/chs/alpha/v1/verified-details', function (req, res) {
  // Create empty array and set error variables to false
  var errors = []
  var codeHasError = false
  var dayHasError = false
  var monthHasError = false
  var yearHasError = false
  var detailsError = false

  // Check if user has filled out a email
  if (req.session.data['personalCode'] === '') {
    // No value so add error to array
    codeHasError = true
    detailsError = true
    errors.push({
      text: 'Enter the correct Companies House personal code',
      href: '#personalCode'
    })
  }

  // Check if user has filled out a day
  if (req.session.data['verifiedDob-day'] === '') {
    // No value so add error to array
    dayHasError = true
    detailsError = true
    errors.push({
      text: 'The date must include a day',
      href: '#verifiedDob-day'
    })
  }
    
  // Check if user has filled out a month
  if (req.session.data['verifiedDob-month'] === '') {
    // No value so add error to array
    monthHasError = true
    detailsError = true
    errors.push({
      text: 'The date must include a month',
      href: '#verifiedDob-day'
    })
  }
    
  // Check if user has filled out a year
  if (req.session.data['verifiedDob-year'] === '') {
    // No value so add error to array
    yearHasError = true
    detailsError = true
    errors.push({
      text: 'The date must include a year',
      href: '#verifiedDob-day'
    })
  }


  // Check if ether filed not filled out
  if (detailsError) {
    // Re-show page with error value as true so errors will show
    res.render('chs/alpha/v1/verified-details', {
      errorVerified: detailsError,
      errorVerifiedDobDay: dayHasError,
      errorVerifiedDobMonth: monthHasError,
      errorVerifiedDobYear: yearHasError,
      errorVerifiedCode: codeHasError,
      errorList: errors
    })
  } else if (req.session.data['personalCode'] === '444-5555-6666'){
    errors.push({
    text: 'You have entered incorrect verification details. Check your Companies House personal code and date of birth, and try again.',
    href: '#personalCode'
    })
    
    res.render('chs/alpha/v1/verified-details', {
      errorVerified: true,
      matchError: true,
      errorVerifiedDobDay: true,
      errorVerifiedDobMonth: true,
      errorVerifiedDobYear: true,
      errorList: errors
    })
  } else if (req.session.data['personalCode'] === '111-2222-3333'){
    // User inputted incorrect value so move to fail page
    res.redirect('/chs/alpha/v1/binding-fail-locked')
  } else {
    // User inputted value so move to next page
    res.redirect('/chs/alpha/v1/binding-success')
  }
})






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

