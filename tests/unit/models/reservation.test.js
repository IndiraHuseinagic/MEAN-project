const {Reservation} = require('../../../models/reservation');
const moment = require('moment');

describe('reservation.setRentalFee', () => {
 

  it('should set rental fee according for given reservation', () => {
    
    let reservation = new Reservation({
        user: {
          name: '12345',
          email: 'email@gmail.com',
          phone: '12345'
        },
         apartment: {
          title: 'New Apartment',
          imageUrl: 'imageUrl',
          address: 'Munich',
          dailyPrice: 100
        },
        checkIn:  new Date('2021/11/11'),
        checkOut: new Date('2021/11/12')
        });
   
        reservation.setRentalFee();

        expect(reservation.rentalFee).toBe(100);
  });
});




  