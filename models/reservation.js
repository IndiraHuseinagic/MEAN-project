const Joi = require('joi');
const validate = require("../middleware/validate");
const mongoose = require('mongoose');
const moment = require('moment');

const reservationSchema = new mongoose.Schema({
  user: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  apartment: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      imageUrl: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      dailyPrice: {
        type: Number,
        required: true,
        min:0,
        max:255
      }
    }),
    required: true
  },
  checkIn: { 
    type: Date, 
    required: true,
  },
  checkOut: { 
    type: Date,
    required: true
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
});

reservationSchema.statics.lookup = function(userId, apartmentId) {
  return this.findOne({
    'user._id': userId,
    'apartment._id': apartmentId,
  });
}

reservationSchema.methods.setRentalFee = function() {
  let checkIn =  moment(this.checkIn, "YYYY-MM-DD");
  let checkOut = moment(this.checkOut, "YYYY-MM-DD");

  const rentalDays = checkOut.diff(checkIn, 'days');

  this.rentalFee = rentalDays * this.apartment.dailyPrice;
}

const Reservation = mongoose.model('Reservation', reservationSchema);

function validateReservation(reservation) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    apartmentId: Joi.objectId().required(),
    checkIn: Joi.date().required(),
    checkOut: Joi.date().required()
  });

  return schema.validate(reservation);  
}

module.exports.Reservation = Reservation; 
module.exports.validate = validateReservation;