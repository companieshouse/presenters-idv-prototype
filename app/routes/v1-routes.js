// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

/* ---------------- Backend test scenario selection --------------- */

router.post('/V1/backend-check-verified-or-not', (req, res) => {
  const chsOrWebFiling = req.session.data['chsOrWebFiling']
  if (chsOrWebFiling === 'webfiling') {
    res.redirect('/V1/webfiling/sign-in-to-webfiling')
  } else {
    res.redirect('/V1/update-rea/start')
  }
})

/* ---------------- GOV.UK One Login flow --------------- */

router.post('/V1/start-now', (req, res) => {
  res.redirect('/V1/govuk-login-registration')
})

router.post('/V1/govuk-login-registration', (req, res) => {
  res.redirect('/V1/gov-onelogin-email')
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

/* ---------------- Company identification flow --------------- */

router.post('/V1/company-number', (req, res) => {
  res.redirect('/V1/confirm-correct-company')
})

router.post('/V1/confirm-correct-company', (req, res) => {
  res.redirect('/V1/company-authentication')
})

router.post('/V1/company-authentication', (req, res) => {
  res.redirect('/V1/presenter-type-radio')
})

/* ---------------- Presenter type and ACSP flow --------------- */

router.post('/V1/presenter-type-radio', (req, res) => {
  const type = req.session.data['what-type-of-presenter']
  const acspLinking = req.session.data['acspLinking']

  if (type === 'none') {
    res.redirect('/V1/stop-screen-1')
    return
  }

  if (type === 'acsp' || type === 'acspEmployee') {
    if (acspLinking === 'ACSPnotLinked') {
      res.redirect('/V1/stop-screen-sign-in-acsp')
    } else {
      res.redirect('/V1/confirm-acsp-statements')
    }
  } else if (type === 'director' || type === 'employeeCompany' || type === 'employeeCorporate') {
    res.redirect('/V1/confirm-presenter-statements')
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

/* ---------------- Presenter information and identity verification --------------- */

router.post('/V1/confirm-presenter-information', (req, res) => {
  const chsOrWebFiling = req.session.data['chsOrWebFiling']
  const backend = req.session.data['backEndVerification']

  if (backend === 'backendVerified') {
    // Already verified → branch immediately to correct service
    if (chsOrWebFiling === 'webfiling') {
      res.redirect('/V1/webfiling/termination-of-a-director')
    } else {
      res.redirect('/V1/update-rea/change-email-address')
    }
  } else {
    // Needs identity verification
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

router.post('/V1/verify-your-identity-answer', (req, res) => {
  res.redirect('/V1/verify-identity-external-link')
})

router.post('/V1/verify-identity-external-answer', (req, res) => {
  res.redirect('/V1/loading-screen')
})

/* ---------------------- Enter Details validation -------------------------- */

router.post('/V1/enter-details-answer', (req, res) => {
  const normaliseCode = (val) => (val || '')
    .replace(/\s/g, '')
    .replace(/[^\w]/g, '')
    .slice(0, 20)

  const authCodeRaw  = req.body.authenticationCode || ''
  const authCode  = normaliseCode(authCodeRaw)

  const day   = (req.body['date-of-birth-day']   || '').trim()
  const month = (req.body['date-of-birth-month'] || '').trim()
  const year  = (req.body['date-of-birth-year']  || '').trim()

  let errors = {}
  let errorList = []

  // Authentication code validation
  if (!authCode) {
    errors.authCode = 'Enter your Companies House personal code'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  } else if (!/^[\w]{11}$/.test(authCode)) {
    errors.authCode = 'This code is invalid'
    errorList.push({ text: errors.authCode, href: '#authentication-code' })
  }

  // Date of birth validation
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

  // Save values
  req.session.data.authenticationCode = authCodeRaw
  req.session.data['date-of-birth-day'] = day
  req.session.data['date-of-birth-month'] = month
  req.session.data['date-of-birth-year'] = year

  if (Object.keys(errors).length > 0) {
    req.session.data.failedAttempts = (req.session.data.failedAttempts || 0) + 1
    
    if (req.session.data.failedAttempts >= 3) {
      delete req.session.data.failedAttempts
      res.redirect('/V1/stop-screen-acsp')
    } else {
      req.session.data.errors = errors
      req.session.data.errorList = errorList
      res.redirect('/V1/enter-details-error')
    }
  } else {
    // Success → branch into correct service
    delete req.session.data.failedAttempts
    delete req.session.data.errors
    delete req.session.data.errorList

    const chsOrWebFiling = req.session.data['chsOrWebFiling']
    if (chsOrWebFiling === 'webfiling') {
      res.redirect('/V1/webfiling/termination-of-a-director')
    } else {
      res.redirect('/V1/update-rea/change-email-address')
    }
  }
})

/* ---------------- WebFiling specific routes --------------- */

router.post('/V1/webfiling/sign-in-to-webfiling', (req, res) => {
  res.redirect('/V1/govuk-login-registration')
})

router.post('/V1/webfiling/termination-of-a-director', (req, res) => {
  res.redirect('/V1/webfiling/confirmation-of-submission')
})

/* ---------------- Update REA service routes --------------- */

router.post('/V1/update-rea/change-email-address', (req, res) => {
  res.redirect('/V1/update-rea/check-your-answer')
})

router.post('/V1/update-rea/check-your-answer', (req, res) => {
  res.redirect('/V1/update-rea/update-submitted')
})

/* ---------------- Legacy/cleanup routes --------------- */

router.post('/V1/company-authentification-answer', (req, res) => {
  res.redirect('/V1/limited-partnership-overview')
})

module.exports = router;
