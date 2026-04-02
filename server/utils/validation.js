const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateSignup = (data) => {
  const errors = [];
  if (!data.email || !isValidEmail(data.email)) errors.push('Invalid email address');
  if (!data.name || data.name.length < 2) errors.push('Name must be at least 2 characters');
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

module.exports = {
  isValidEmail,
  validateSignup
};
