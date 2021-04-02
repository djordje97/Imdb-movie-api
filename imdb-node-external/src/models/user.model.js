const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      // eslint-disable-next-line no-useless-escape
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      maxlength: 255,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  },
  { timestamps: true },
);

userSchema.pre('save', function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function compare(pw) {
  return bcrypt.compare(pw, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
