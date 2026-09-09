const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildValidationError = (field, message) => ({
  field,
  message
});

const validateEmail = (email, errors) => {
  if (!email) {
    errors.push(buildValidationError('email', 'Email is required'));
    return;
  }

  if (!emailRegex.test(email)) {
    errors.push(buildValidationError('email', 'Email must be valid'));
  }
};

const validatePassword = (password, errors) => {
  if (!password) {
    errors.push(buildValidationError('password', 'Password is required'));
    return;
  }

  if (password.length < 6) {
    errors.push(
      buildValidationError('password', 'Password must be at least 6 characters')
    );
  }
};

const sendValidationErrors = (res, errors) => {
  if (errors.length === 0) {
    return false;
  }

  res.status(400).json({
    message: 'Validation failed',
    errors
  });

  return true;
};

export const validateSignup = (req, res, next) => {
  const errors = [];
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name) {
    errors.push(buildValidationError('name', 'Name is required'));
  }

  validateEmail(email, errors);
  validatePassword(password, errors);

  if (sendValidationErrors(res, errors)) {
    return;
  }

  req.body.name = name;
  req.body.email = email;
  next();
};

export const validateLogin = (req, res, next) => {
  const errors = [];
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  validateEmail(email, errors);
  validatePassword(password, errors);

  if (sendValidationErrors(res, errors)) {
    return;
  }

  req.body.email = email;
  next();
};
