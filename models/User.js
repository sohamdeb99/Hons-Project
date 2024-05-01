const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving to the database
// UserSchema.pre('save', function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();
//   bcrypt.hash(user.password, 10, (err, hash) => {
//     if (err) return next(err);
//     user.password = hash;
//     next();
//   });
// });

module.exports = mongoose.model('User', UserSchema);
