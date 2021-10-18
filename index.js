const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/dist')));

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));


//app.use((req, res, next) => {
//    next(createError(404));
// });
  

//app.get('/', (req, res) => {
//    res.send('invaild endpoint');
 // });
 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});
  
  // error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = server;