const { Schema } = require("mongoose");
const passportLocalMongooseImport = require("passport-local-mongoose");
const passportLocalMongoose =
  passportLocalMongooseImport.default || passportLocalMongooseImport;

const UserSchema = new Schema({
  username: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  balance: { type: Number, default: 10000 },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessages: {
    UserExistsError: "An account with that email already exists",
    IncorrectPasswordError: "Incorrect password",
    IncorrectUsernameError: "No account with that email",
  },
});

module.exports = { UserSchema };
