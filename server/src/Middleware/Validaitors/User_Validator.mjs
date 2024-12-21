import { checkSchema } from "express-validator";

const Validate_Register = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Must be a valid email",
    },
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    trim: true, // Remove the white spaces
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
    trim: true,
  },
  confirmPassword: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
    notEmpty: {
      errorMessage: "Confirm password must not be empty",
    },
    trim: true,
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: "Passwords do not match",
    },
  },
});

const Validate_Login = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Must be a valid email.",
    },
    notEmpty: {
      errorMessage: "Email must not be empty.",
    },
    trim: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters.",
    },
    notEmpty: {
      errorMessage: "Password must not be empty.",
    },
    trim: true,
  },
});

export { Validate_Register, Validate_Login };
