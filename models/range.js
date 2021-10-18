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

function validateRented(rented) {
    const schema = Joi.object({
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required(),
        reservationId: Joi.objectId().required(),
    });
  return schema.validate(rented);      
} 

exports.Rented = Rented;
exports.validate = validateRented;
exports.rentedSchema = rentedSchema;
