import { checkSchema } from "express-validator";

const Validate_Register = checkSchema({
  name: { 
    optional: true, 
    notEmpty: {
      errorMessage: "First name must not be empty",
    },
    isLength: {
      options: { min: 2, max: 70 },
      errorMessage: "First name must be between 2 and 70 characters",
    },
    trim: true,
  },
  lastname: {
    optional: true, 
    notEmpty: {
      errorMessage: "Last name must not be empty",
    },
    isLength: {
      options: { min: 2, max: 70 },
      errorMessage: "Last name must be between 2 and 70 characters",
    },
    trim: true,
  },
  phone_number: {
    notEmpty: {
      errorMessage: "Phone number must not be empty",
    },
    isNumeric: {
      errorMessage: "Phone number must only contain numbers",
    },
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "Phone number must be between 10 and 15 digits",
    },
    trim: true,
  },
  email: {
    isEmail: {
      errorMessage: "Must be a valid email",
    },
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    trim: true,
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
    notEmpty: {
      errorMessage: "Confirm password must not be empty",
    },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: "Passwords do not match",
    },
    trim: true,
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
