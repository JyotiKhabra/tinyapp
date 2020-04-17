const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helper_functions/finduserhelpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ481W" },
  "9sm5xk": { longURL: "http://www.google.ca", userID: "aJ481W" }
};

describe('urlsForUser', function() {
  it('should return urls associated with user', function() {
    const userID = urlsForUser("aJ481W", testUrlDatabase);
    const expectedOutput =
    {"b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ481W" },
      "9sm5xk": { longURL: "http://www.google.ca", userID: "aJ481W" }};
    assert.deepEqual(userID, expectedOutput);
  });
});


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user =  getUserByEmail("user@example.com", testUsers);
    const expectedOutput =
   { id: "userRandomID",
     email: "user@example.com",
     password: "purple-monkey-dinosaur" };

    assert.deepEqual(user, expectedOutput);
  });
});

