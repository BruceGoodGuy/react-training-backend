// middleware/validate.js
const { formatYupErrors } = require("../utils/validation");

const validate = (schema, getContext = () => ({})) => async (req, res, next) => {
  try {
    // Tạo context object mới kết hợp từ getContext và một object rỗng
    const context = { ...getContext(req) };
    
    // Validate và truyền context vào
    await schema.validate(req.body, { 
      abortEarly: false, 
      context: {
        ...context,
        __req: req // Thêm req vào context nếu cần
      } 
    });
    
    // Lưu context trở lại request
    req.context = { ...req.context, ...context };
    
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