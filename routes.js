const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router(); //no outside install needed | Router is included with Express
const items = require('./fakeDb');

console.log('routes file loaded');

router.get('/', (request, response, next) => {
   try {
      return response.json({ items });
   } catch (error) {
      return next(error);
   }
});

router.get('/:name', (request, response, next) => {
   try {
      const itemName = request.params.name;
      const item = items.find((item) => item.name === itemName);
      if (!item) {
         throw new ExpressError(`Item '${itemName}' was not found`, 404);
      }

      return response.json({ item });
   } catch (error) {
      return next(error);
   }
});

router.post('/', function (request, response, next) {
   try {
      //body is what we got back from the request | if no name or price, then throw error
      if (!request.body.name || !request.body.price)
         throw new ExpressError('Name and price are required!', 400);
      const newItem = { name: request.body.name, price: request.body.price };
      items.push(newItem);

      return response.status(201).json({ item: newItem });
   } catch (error) {
      return next(error);
   }
});

router.patch('/:name', function (request, response, next) {
   console.log('PATCH route');
   try {
      const itemName = request.params.name; //so we are grabbing the item, and then updating the item, then pushing that item (with updates), to the patch
      const foundItem = items.find((item) => item.name === itemName);
      if (!foundItem) {
         throw new ExpressError('Item not found', 404);
      }
      if (request.body.name) foundItem.name = request.body.name; //if there is a name, update it
      if (request.body.price) foundItem.price = request.body.price; //if there is a price, update it

      return response.json({ item: foundItem });
   } catch (error) {
      return next(error);
   }
});

router.delete('/:name', (request, response, next) => {
   console.log('DELETE route');
   try {
      const itemName = request.params.name;
      const itemIndex = items.findIndex((item) => item.name === itemName); //findIndex | returns the index of the first element in an array that matches the callback parameters
      console.log('--Item Index', itemIndex);
      //itemIndex returns -1 if there is no match
      if (itemIndex === -1) {
         throw new ExpressError(`Item '${itemName}' was not found`, 404);
      }

      items.splice(itemIndex, 1); //splicing from the items array
      return response.json({ message: 'Deleted' });
   } catch (error) {
      return next(error);
   }
});

module.exports = router;
