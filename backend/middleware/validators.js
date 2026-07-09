const { body, validationResult } = require("express-validator");

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg);
  }
  next();
}

const validateNewOrder = [
  body("name").trim().notEmpty().withMessage("Stock name is required"),
  body("qty")
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be a positive number"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("mode").isIn(["BUY", "SELL"]).withMessage("Mode must be BUY or SELL"),
  handleValidationErrors,
];

const validateRegister = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateFundsAmount = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Enter a valid amount greater than 0"),
  handleValidationErrors,
];

module.exports = {
  validateNewOrder,
  validateRegister,
  validateLogin,
  validateFundsAmount,
};
