//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


/* ---------------- Existing flows (unchanged where possible) --------------- */

// router.post('/V1/start', (req, res) => {
//   req.session.data['backEndVerification'] = req.body.backEndVerification
//   res.redirect('/V1/start')
// })

// router.post('/V1/start-now', (req, res) => {
//   res.redirect('/V1/govuk-login-registration')
// })


router.post('/V1/backend-check-verified-or-not', (req, res) => {
  const chsOrWebFiling = req.session.data['chsOrWebFiling']
  if (chsOrWebFiling === 'webfiling') {
    res.redirect('/V1/webfiling/sign-in-to-webfiling')
  } else {
    res.redirect('/V1/update-rea/start')
  }
})

router.post('/V1/gov-onelogin-email-answer', (req, res) => {
  res.redirect('/V1/gov-onelogin-password')
})

router.post('/V1/gov-onelogin-password-answer', (req, res) => {
  res.redirect('/V1/gov-onelogin-enter-code')
})

router.post('/V1/gov-onelogin-enter-code', (req, res) => {
  res.redirect('/V1/company-number')
})

router.post('/V1/presenter-type-radio', (req, res) => {
  const type = req.session.data['what-type-of-presenter']
  const backend = req.session.data['backEndVerification']
  const acspLinking = req.session.data['acspLinking']

  if (type === 'acsp') {
    if (acspLinking === 'ACSPlinked') {
      res.redirect('/V1/confirm-acsp-statements')
    } else if (acspLinking === 'ACSPnotLinked') {
      res.redirect('/V1/stop-screen-acsp')
    } else {
      // Fallback if acspLinking is not set or has unexpected value
      res.redirect('/V1/confirm-acsp-statements')
    }
  } else if (type === 'acspEmployee') {
    // New route for ACSP employees - always go to ACSP statements page
    res.redirect('/V1/confirm-acsp-statements')
  } else if (type === 'none') {
    res.redirect('/V1/stop-screen-1')
  } else if (type === 'director' || type === 'employeeCompany' || type === 'employeeCorporate') {
    if (!backend || backend === 'backendVerified') {
      res.redirect('/V1/confirm-presenter-statements')
    } else if (backend === 'backendNotVerified') {
      res.redirect('/V1/identity-verified-CH')
    }
  } else {
    res.redirect('/V1/confirm-presenter-statements')
  }
})

router.post('/V1/confirm-acsp-statements-answer', (req, res) => {
  res.redirect('/V1/confirm-presenter-information')
})

router.post('/V1/confirm-presenter-statements', (req, res) => {
    res.redirect('/V1/confirm-presenter-information')
})

router.post('/V1/identity-verified-answer', (req, res) => {
  const idVerified = req.session.data['identity-verified']
  if (idVerified === 'yes') {
    res.redirect('/V1/enter-details')
  } else {
    res.redirect('/V1/verify-your-identity')
  }
})

/* ---------------------- Enter Details validation -------------------------- */

router.post('/V1/enter-details-answer', (req, res) => {
  // normalise to alphanumeric only (remove spaces, NBSP, hyphens, etc.)
  const normaliseCode = (val) => (val || '')
    .replace(/\s/g, '')       // remove all whitespace (incl. NBSP)
    .replace(/[^\w]/g, '')    // keep letters, numbers, underscore only
    .slice(0, 20)             // hard cap, just in case

  // IMPORTANT: these names must match your HTML inputs
  const authCodeRaw  = req.body.authenticationCode || ''
  const authCode  = normaliseCode(authCodeRaw)

  const day   = (req.body['date-of-birth-day']   || '').trim()
  const month = (req.body['date-of-birth-month'] || '').trim()
  const year  = (req.body['date-of-birth-year']  || '').trim()

  let errors = {}
  let errorList = []

  // --- Authentication Code ---
  if (!authCode) {
    errors.authCode = 'Enter your Companies House personal code'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  } else if (!/^[\w]{11}$/.test(authCode)) {
    errors.authCode = 'This code is invalid'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  }

  // --- Date of Birth ---
  const dayNum = parseInt(day, 10)
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)

  if (!day || !month || !year) {
    errors.dateOfBirth = 'Enter your date of birth'
    errorList.push({ text: errors.dateOfBirth, href: '#date-of-birth-day' })
  } else {
    const dateObj = new Date(yearNum, monthNum - 1, dayNum)
    const today = new Date()

    if (
      Number.isNaN(dayNum) || Number.isNaN(monthNum) || Number.isNaN(yearNum) ||
      dateObj.getDate() !== dayNum ||
      dateObj.getMonth() !== monthNum - 1 ||
      dateObj.getFullYear() !== yearNum
    ) {
      errors.dateOfBirth = 'Enter a valid date'
      errorList.push({ text: errors.dateOfBirth, href: '#date-of-birth-day' })
    } else if (dateObj > today) {
      errors.dateOfBirth = 'Enter a valid date in the format DD/MM/YYYY'
      errorList.push({ text: errors.dateOfBirth, href: '#date-of-birth-day' })
    }
  }

  // Save values for repopulation (match your templates' keys)
  req.session.data.authenticationCode = authCodeRaw        // show what the user typed
  req.session.data['date-of-birth-day'] = day
  req.session.data['date-of-birth-month'] = month
  req.session.data['date-of-birth-year'] = year

  if (Object.keys(errors).length > 0) {
    // Track failed attempts
    req.session.data.failedAttempts = (req.session.data.failedAttempts || 0) + 1
    
    // Check if user has reached 3 failed attempts
    if (req.session.data.failedAttempts >= 3) {
      // Clear the failed attempts counter and redirect to lockout screen
      delete req.session.data.failedAttempts
      res.redirect('/V1/stop-screen-acsp')
    } else {
      // Still have attempts left, show error page
      req.session.data.errors = errors
      req.session.data.errorList = errorList
      res.redirect('/V1/enter-details-error')
    }
  } else {
    // Success - clear any failed attempts and continue
    delete req.session.data.failedAttempts
    delete req.session.data.errors
    delete req.session.data.errorList
    res.redirect('/V1/guide-user-next-steps')
  }
})

/* --------------------------- Remaining routes ---------------------------- */

// Add this route to handle confirm-presenter-information form submission
router.post('/V1/confirm-presenter-information', (req, res) => {
  const chsOrWebFiling = req.session.data['chsOrWebFiling'];

  if (chsOrWebFiling === 'webfiling') {
    res.redirect('/V1/webfiling/termination-of-a-director');
  } else {
    res.redirect('/V1/update-rea/change-email-address');
  }
});

// router.post('/V1/confirm-presenter-information-answer', (req, res) => {
//   res.redirect('/V1/company-number')
// }) JF: I don't think this route is doing anything

router.post('/V1/company-number', (req, res) => {
  res.redirect('/V1/confirm-correct-company')
})

router.post('/V1/confirm-correct-company', (req, res) => {
  res.redirect('/V1/company-authentication')
})

router.post('/V1/company-authentication', (req, res) => {
  res.redirect('/V1/presenter-type-radio')
})

router.post('/V1/company-authentification-answer', (req, res) => {
  res.redirect('/V1/limited-partnership-overview')
})

router.post('/V1/verify-your-identity-answer', (req, res) => {
  res.redirect('/V1/verify-identity-external-link')
})

router.post('/V1/verify-identity-external-answer', (req, res) => {
  res.redirect('/V1/identity-verification-complete')
})

module.exports=router;