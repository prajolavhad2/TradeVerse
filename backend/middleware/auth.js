function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("Not authenticated");
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Not authorized");
    }
    return next();
  };
}

module.exports = { ensureAuthenticated, authorize };
