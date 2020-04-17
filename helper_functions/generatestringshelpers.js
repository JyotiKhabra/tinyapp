
//Helper functions to generate tinyURL and userID


function generateRandomString() {
  let tinyURL = Math.random().toString(36).substring(6);
  return tinyURL;
}; 


function generateRandomId() {
  let userId = Math.random().toString(36).substring(6);
  return userId;
};

module.exports = { 
  generateRandomString, 
  generateRandomId
};

