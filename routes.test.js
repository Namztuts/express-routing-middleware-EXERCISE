process.env.NODE_ENV = 'test'; //NOTE: setting an environment variable
const request = require('supertest'); //import supertest

const app = require('./app'); //import our app
let items = require('./fakeDb'); //import the DB

let item = { name: 'TestItem', price: 1.99 };

//before each test, we push the TestItem into the items array (fakeDB)
beforeEach(function () {
    items.push(item);
 });
 
 afterEach(function () {
    // make sure this mutates, not redefines, `items`
    items.length = 0;
 });

 
describe('1. GET from /items', () => {
    // NOTE: since we have to wait to get the data back, asyncronous, we will use async and await
    test('1-1. get all items', async () => {
       const response = await request(app).get('/items'); //results in a response object
       expect(response.statusCode).toBe(200); //toBe compares their reference | toEqual compares the contents
       expect(response.body).toEqual({ items }); //body is what we got back from the request
    });
 });
 
 describe('2. GET from /items/:name', () => {
    test('2-1. get item by name', async () => {
       const response = await request(app).get(`/items/${item.name}`);
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ item });
    });
    test('2-2. responds with 404 for invalid item', async () => {
       const response = await request(app).get(`/cats/badItem`);
       expect(response.statusCode).toBe(404);
    });
 });
 
 describe('3. POST to /items', () => {
    test('3-1. creating an item', async () => {
       const response = await request(app).post('/items').send({ name: 'NewItem', price: 0.99 });
       const item = { name: 'NewItem', price: 0.99 };
       expect(response.statusCode).toBe(201);
       expect(response.body).toEqual({ item: item });
    });
    test('3-2. responds with 400 if name is missing', async () => {
       const response = await request(app).post('/items').send({});
       expect(response.statusCode).toBe(400);
    });
 });
 
 describe('4. PATCH to /items/:name', () => {
    test('4-1. updating an item', async () => {
       const response = await request(app)
          .patch(`/items/${item.name}`)
          .send({ name: 'UpdatedItem' });
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ item: { name: 'UpdatedItem', price: 1.99 } });
    });
    test('4-2. responds with 404 for invalid name', async () => {
       const response = await request(app)
          .patch(`/cats/NotReal`)
          .send({ name: 'UpdatedItem' });
       expect(response.statusCode).toBe(404);
    });
 });
 
 describe('5. DELETE to /items/:name', () => {
    test('5-1. deleting an item', async () => {
       const response = await request(app).delete(`/items/${item.name}`);
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({ message: 'Deleted' });
    });
    test('5-2. responds with 404 for deleting invalid item', async () => {
       const response = await request(app).delete(`/cats/croissant`);
       expect(response.statusCode).toBe(404);
    });
 });
 