const HttpError = require('../exceptions/exceptions');

const authorizeRoles = (...allowed) => {
  const isAllowed = tokenRoles => allowed.some(allowedRole => tokenRoles.includes(allowedRole));

  return (req, res, next) => {
    const tokenRoles = req.user.user.roles.map(tokenRole => tokenRole.name);
    if (req.user && isAllowed(tokenRoles)) {
      return next();
    }
    throw new HttpError(403, 'Forbidden!');
  };
};

module.exports = authorizeRoles;
