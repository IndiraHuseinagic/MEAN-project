const categories = require('../routes/categories');
const apartments = require('../routes/apartments');
const reservations = require('../routes/reservations');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app){
  app.use('/api/categories', categories);
  app.use('/api/apartments', apartments);
  app.use('/api/reservations', reservations);
  app.use('/api/users', users); //register
  app.use('/api/auth', auth);   //login
}




 
  
 
  
  