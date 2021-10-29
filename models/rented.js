const Joi = require('joi');
const mongoose = require('mongoose');

const rentedSchema = new mongoose.Schema({
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
const Rented = mongoose.model('Rented', rentedSchema);

exports.Rented = Rented;
exports.rentedSchema = rentedSchema;
