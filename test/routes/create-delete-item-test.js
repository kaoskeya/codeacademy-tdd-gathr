const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  const itemToCreate = buildItemObject();
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  // Write your test blocks below:
  it('creates, saves and deleted an item', async () => {
    
    const response = await request(app)
      .post('/items/create')
      .type('form')
      .send(itemToCreate);
    const createdItem = await Item.findOne(itemToCreate);
    assert.isOk(createdItem, 'Item was created successfully in the database');

    const fetchedResponse = await request(app).post(`/items/${createdItem._id}/delete`);
    assert.notEqual(parseTextFromHTML(fetchedResponse.text, 'body'), itemToCreate.title);
    assert.notEqual(parseTextFromHTML(fetchedResponse.text, 'body'), itemToCreate.description);
  })
  
});
