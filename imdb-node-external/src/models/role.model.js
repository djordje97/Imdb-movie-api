const mongoose = require('mongoose');

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    enum: ['ADMIN', 'REGULAR'],
  },
});

const Roles = mongoose.model('Role', roleSchema);

module.exports = Roles;
