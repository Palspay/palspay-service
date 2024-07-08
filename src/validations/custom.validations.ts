export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
  };
  
  export const password = (value, helpers) => {
    if (value.length < 8) {
      return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
  };

  export const otp_length = (value, helpers) => {
    if (value.length < 6) {
      return helpers.message('otp must be at least 6 digits');
    }
    return value;
  };
  export const passcode = (value, helpers) => {
    if (value.length < 6) {
      return helpers.message('Passcode must be at least 4 digits');
    }
    return value;
  };