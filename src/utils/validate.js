const validator = require("validator");

const validateSignUpData = function (req) {
  const { firstName, lastName, emailId, password, skills } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("please provide the required fields");
  } else if (firstName.lenght < 3 || firstName.length > 50) {
    throw new Error("firstName must be between 3 and 50 characters");
  } else if (lastName.lenght < 3 || lastName.length > 50) {
    throw new Error("lastName must be between 3 and 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};

const validateLoginData = function (req) {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("please provide the required fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Incorrect email address");
  }
};

const validateProfileEditData = function (req) {
  const allowedEditFields = [
    "profileUrl",
    "age",
    "gender",
    "about",
    "skills",
    "hobbies",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validatePasswordChangeData = function (req) {
  const allowedFields = ["currentPassword", "newPassword"];
  const isAllowedFielld = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (!isAllowedFielld) {
    throw new Error("Please provide the correct feilds");
  }
  if (!validator.isStrongPassword(req.body.newPassword)) {
    throw new Error("Please provide the correct format of new password");
  }
  return;
};

const validateSendRequest = function (req, status) {
  const allowedStatus = ["interested", "ignored"];
  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status");
  }
};

const validateUsernameAndPassword = function (req) {};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateProfileEditData,
  validateUsernameAndPassword,
  validatePasswordChangeData,
  validateSendRequest,
};
