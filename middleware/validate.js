// middleware/validate.js
const { formatYupErrors } = require('../utils/validation');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json({
        success: false,
        errors: formatYupErrors(error)
      });
    }
    next(error);
  }
};

module.exports = validate;