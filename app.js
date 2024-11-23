const express = require('express');
const ExpressError = require('./expressError');
const routes = require('./routes'); //importing routes from the userRoutes file
const app = express();

console.log('app file loaded');
// so we send a post request with Insomnia, then the server sends back a response object and the client has access to the data
/*
Send POST request data like this
{
    'name': 'cup',
    'price': 1.99
}
*/

app.use(express.json());
app.use('/items', routes); //NOTE: the 'magic' for routers

// 404 handler
app.use(function (request, response, next) {
   return next(new ExpressError('404 | Not Found', 404));
});

// generic error handler
app.use(function (error, request, response, next) {
   // the default status is 500 Internal Server Error
   let status = error.status || 500;

   // set the status and alert the user
   return response.status(status).json({
      error: {
         message: error.message,
         status: status,
      },
   });
});

module.exports = app;
