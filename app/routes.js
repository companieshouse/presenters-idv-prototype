//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//


const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

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

// Version 1 routes
// Backend test scenario route (EXISTING)
router.post('/V1/start', function (req, res) {
  req.session.data['backEndVerification'] = req.body.backEndVerification;
  res.redirect('/V1/presenter-type-radio');
});

// Start page to GOV.UK login
router.post('/V1/start-now', function(request, response) {
  response.redirect('/V1/govuk-login-registration')
})

// GOV.UK OneLogin email to password
router.post('/V1/gov-onelogin-email-answer', function(request, response) {
  response.redirect('/V1/gov-onelogin-password')
})

// GOV.UK OneLogin password to code entry
router.post('/V1/gov-onelogin-password-answer', function(request, response) {
  response.redirect('/V1/gov-onelogin-enter-code')
})

// GOV.UK OneLogin code to presenter type
router.post('/V1/gov-onelogin-code-answer', function(request, response) {
  response.redirect('/V1/presenter-type-radio')
})

// Main presenter type routing logic
router.post('/V1/presenter-type-radio', function(request, response) {
  var whatTypeOfPresenter = request.session.data['what-type-of-presenter']
  var backEndVerification = request.session.data['backEndVerification']
  
  if (whatTypeOfPresenter == 'acsp') {
    response.redirect('/V1/confirm-acsp-statements')
  } else if (whatTypeOfPresenter == 'none') {
    response.redirect('/V1/error-page')
  } else if (whatTypeOfPresenter == 'director' || whatTypeOfPresenter == 'employeeCompany' || whatTypeOfPresenter == 'employeeCorporate') {
    // Check backend verification status for these presenter types
    if (!backEndVerification || backEndVerification == 'backendVerified') {
      response.redirect('/V1/confirm-director-statements')
    } else if (backEndVerification == 'backendNotVerified') {
      response.redirect('/V1/identity-verified-CH')
    }
  } else {
    // Default fallback
    response.redirect('/V1/confirm-director-statements')
  }
})

// ACSP statements to presenter information
router.post('/V1/confirm-acsp-statements-answer', function(request, response) {
  response.redirect('/V1/confirm-presenter-information')
})

// Director statements routing
router.post('/V1/confirm-director-statements-answer', function(request, response) {
  var statements = request.session.data['director-statements']
  
  if (statements && statements.includes('verified')) {
    response.redirect('/V1/company-number')
  } else {
    response.redirect('/V1/identity-verified-CH')
  }
})

// Identity verification check
router.post('/V1/identity-verified-answer', function(request, response) {
  var identityVerified = request.session.data['identity-verified']
  
  if (identityVerified == 'yes') {
    response.redirect('/V1/enter-details')
  } else {
    response.redirect('/V1/verify-your-identity')
  }
})

// Enter details to presenter information
router.post('/V1/enter-details-answer', function(request, response) {
  response.redirect('/V1/confirm-presenter-information')
})

// Presenter information to company number
router.post('/V1/confirm-presenter-information-answer', function(request, response) {
  response.redirect('/V1/company-number')
})

// Company number to confirm company
router.post('/V1/company-number-answer', function(request, response) {
  response.redirect('/V1/confirm-correct-company')
})

// Confirm company to authentication
router.post('/V1/confirm-correct-company-answer', function(request, response) {
  response.redirect('/V1/company-authentification')
})

// Company authentication (simple continue)
router.post('/V1/company-authentification-answer', function(request, response) {
  response.redirect('/V1/limited-partnership-overview') // or wherever this should go next
})

// Verify identity flow
router.post('/V1/verify-your-identity-answer', function(request, response) {
  response.redirect('/V1/verify-identity-external-link')
})

// External identity verification to completion
router.post('/V1/verify-identity-external-answer', function(request, response) {
  response.redirect('/V1/identity-verification-complete')
})

module.exports = router