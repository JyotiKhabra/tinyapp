
//Helper functions to retrieve user information

function getUserByEmail(email, users){
  for(const id in users){
    let user = users[id]
    if(user.email === email){
      return user
    }
  }
  return null
};


  function urlsForUser(userID, urlDatabase){
  const newObjForUrls = {}
  for(const url in urlDatabase ){
    let oneUser = urlDatabase[url]
    if(oneUser.userID === userID){
    newObjForUrls[url] = oneUser;
  }   
}
  return newObjForUrls; 
};


module.exports = {
  getUserByEmail,
  urlsForUser
};
// module.exports = urlsForUser;


