// middleware/authorizeRole.js
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user has the required role
    if (requiredRole === "admin" && user.isofficer) {
      return next();
    }

    if (requiredRole === "user") {
      return next(); // All authenticated users have 'user' role
    }

    return res.status(403).json({
      success: false,
      message: "Access denied: insufficient permissions",
    });
  };
};

module.exports = authorizeRole;
