// middleware/validate.js
const { formatYupErrors } = require("../utils/validation");

const validate = (schema) => async (req, res, next) => {
  try {
    const context = {};

    // Validate và truyền context vào
    await schema.validate(req.body, {
      abortEarly: false,
      context
    });

    // If validation passes, attach user to request for controller
    req.user = context.user; // Attach user to request for downstream use
    next();
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        errors: formatYupErrors(error),
      });
    }
    next(error);
  }
};

module.exports = validate;
