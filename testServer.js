const app = require('./app');

console.log('server file loaded');

app.listen(3000, function () {
   console.log('Server starting on http://localhost:3000');
});
