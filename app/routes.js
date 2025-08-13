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

/* ---------------- Existing flows (unchanged where possible) --------------- */

router.post('/V1/start', (req, res) => {
  req.session.data['backEndVerification'] = req.body.backEndVerification
  res.redirect('/V1/presenter-type-radio')
})

router.post('/V1/start-now', (req, res) => {
  res.redirect('/V1/govuk-login-registration')
})

router.post('/V1/gov-onelogin-email-answer', (req, res) => {
  res.redirect('/V1/gov-onelogin-password')
})

router.post('/V1/gov-onelogin-password-answer', (req, res) => {
  res.redirect('/V1/gov-onelogin-enter-code')
})

router.post('/V1/gov-onelogin-code-answer', (req, res) => {
  res.redirect('/V1/presenter-type-radio')
})

router.post('/V1/presenter-type-radio', (req, res) => {
  const type = req.session.data['what-type-of-presenter']
  const backend = req.session.data['backEndVerification']

  if (type === 'acsp') {
    res.redirect('/V1/confirm-acsp-statements')
  } else if (type === 'none') {
    res.redirect('/V1/error-page')
  } else if (type === 'director' || type === 'employeeCompany' || type === 'employeeCorporate') {
    if (!backend || backend === 'backendVerified') {
      res.redirect('/V1/confirm-director-statements')
    } else if (backend === 'backendNotVerified') {
      res.redirect('/V1/identity-verified-CH')
    }
  } else {
    res.redirect('/V1/confirm-director-statements')
  }
})

router.post('/V1/confirm-acsp-statements-answer', (req, res) => {
  res.redirect('/V1/confirm-presenter-information')
})

router.post('/V1/confirm-director-statements-answer', (req, res) => {
  const statements = req.session.data['director-statements']
  if (statements && statements.includes('verified')) {
    res.redirect('/V1/company-number')
  } else {
    res.redirect('/V1/identity-verified-CH')
  }
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
  // normalise to digits only (remove spaces, NBSP, hyphens, etc.)
  const normaliseCode = (val) => (val || '')
    .replace(/\s/g, '')       // remove all whitespace (incl. NBSP)
    .replace(/[^\d]/g, '')    // keep digits only
    .slice(0, 20)             // hard cap, just in case

  // IMPORTANT: these names must match your HTML inputs
  const authCodeRaw  = req.body.authenticationCode || ''
  const authCode2Raw = req.body.authenticationCode2 || ''

  const authCode  = normaliseCode(authCodeRaw)
  const authCode2 = normaliseCode(authCode2Raw)

  const day   = (req.body['date-of-birth-day']   || '').trim()
  const month = (req.body['date-of-birth-month'] || '').trim()
  const year  = (req.body['date-of-birth-year']  || '').trim()

  let errors = {}
  let errorList = []

  // --- Authentication Code ---
  if (!authCode) {
    errors.authCode = 'Enter your Companies House personal code'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  } else if (!/^\d{11}$/.test(authCode)) {
    errors.authCode = 'This code is invalid'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  }

  // --- Authentication Code Confirmation ---
  if (!authCode2) {
    errors.authCode2 = 'Enter your Companies House personal code again'
    errorList.push({ text: errors.authCode2, href: '#authentication-code2' })
  } else if (authCode && authCode2 !== authCode) {
    errors.authCode2 = "This code doesn't match the one above"
    errorList.push({ text: errors.authCode2, href: '#authentication-code2' })
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
  req.session.data.authenticationCode2 = authCode2Raw
  req.session.data['date-of-birth-day'] = day
  req.session.data['date-of-birth-month'] = month
  req.session.data['date-of-birth-year'] = year

  if (Object.keys(errors).length > 0) {
    req.session.data.errors = errors
    req.session.data.errorList = errorList
    res.redirect('/V1/enter-details-error')
  } else {
    delete req.session.data.errors
    delete req.session.data.errorList
    res.redirect('/V1/confirm-presenter-information')
  }
})

/* --------------------------- Remaining routes ---------------------------- */

router.post('/V1/confirm-presenter-information-answer', (req, res) => {
  res.redirect('/V1/company-number')
})

router.post('/V1/company-number-answer', (req, res) => {
  res.redirect('/V1/confirm-correct-company')
})

router.post('/V1/confirm-correct-company-answer', (req, res) => {
  res.redirect('/V1/company-authentification')
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

module.exports = router
