const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ481W" },
  "9sm5xk": { longURL: "http://www.google.ca", userID: "aJ481W" }
  // "shortURL": "longURL"
};

const users ={
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "password1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@mail.com",
    password: "password2"
  }
}


function generateRandomString() {
  let tinyURL = Math.random().toString(36).substring(6);
  return tinyURL;
}; 
function generateRandomId() {
  let userId = Math.random().toString(36).substring(6);
  return userId;
};
function getUserByEmail(email){
  for(const id in users){
    let user = users[id]
    if(user.email === email){
      return user
    }
  }
  return null
};    

function getUserFromRequest(req) {
  const email = req.body.email;
  return getUserByEmail(email);
}; 
  
app.get("/", (req, res) => {
  res.render("Hello!");
});
app.get("/urls.json",(req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const userId = req.cookies.id;
  const user = users[userId];
  let templateVars = { user,
  urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/register", (req, res) => {
  const userId = req.cookies.id;
  const user = users[userId];
  let templateVars = { user };
  res.render("urls_register", templateVars);
});
app.get("/urls/new", (req, res) => {
  const email = req.query.email
  console.log("email:", email)
  //const email = req.body.email;
  //console.log("email:", email);
  const user = getUserByEmail(email);
  console.log("user:", user);
  if(!user){
    res.redirect("/urls/login");
  } else { 
  res.cookie("id", user.id);
  let templateVars = { user };
  res.render("urls_new", templateVars);
  }
});
app.get("/urls/login", (req, res) => {
  const userId = req.cookies.id;
  const user = users[userId];
  let templateVars = { user };
  res.render("urls_login", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const userId = req.cookies.id;
  if (userId === urlDatabase[shortURL].userID ) {
    delete urlDatabase[shortURL];
    res.redirect("/urls")
  } else {
    res.status(403).send("You are not logged in!");
  }
});
app.post("/urls/:shortURL/edit", (req, res) => {  
  // TODO: 
  const shortURL = req.params.shortURL;
  //console.log("1",shortURL)
  const userId = req.cookies.id;
  //If user is not logged in
  if(!userId) {
    res.status(403).send("You are not logged in!")
  }else if (userId === urlDatabase[shortURL].userID ) {
    console.log("req.body.longURL", req.body.longURL)
    urlDatabase[shortURL].longURL = req.body.longURL;
    console.log("urlDatabase[shortURL]", urlDatabase[shortURL])
    res.redirect("/urls")
  } else {
    res.status(403).send("You are not authorized to change this URL!");
  }
});
app.post("/urls/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if(user && password === user.password){
    res.cookie("id", user.id);
    res.redirect("/urls")
  } else { 
    res.redirect("/urls/login");
  };
});
app.post("/urls/register", (req, res) => {
  const password = req.body.password;
    //if no password and user exists return error
  if (getUserFromRequest(req) || password === "") {
    res.status(403).send("error");
    //else create new user and generate id
  }else{
    const email = req.body.email;
    const id = generateRandomId();
    users[id] = { id, email, password };
    res.cookie("id", id);
    res.redirect("/urls");
  }
}); 

app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/urls")
});
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("shortURL", shortURL);
  if(urlDatabase[shortURL]){
  //if urlDatabase[shortURL] do stuff below. otherwise error because URL doesn't exist
  const userId = req.cookies.id;
  const user = users[userId];
  const longURL = urlDatabase[shortURL].longURL
  let templateVars = {shortURL, longURL, user};
  res.render("urls_show", templateVars);
  }else {
    res.redirect("/urls");
  }
});
app.post("/urls", (req, res) => {
  const id = req.cookies.id;
  if(id){
    console.log("before", urlDatabase)
    urlDatabase[generateRandomString()] = {longURL : req.body.longURL, userID: id };
    console.log("After",urlDatabase)
    res.redirect("/urls");
  } else {
    res.status(403).send("You are not logged in!");
}
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("shortURL 1", shortURL, urlDatabase)
  console.log("urlDatabase[shortURL]", urlDatabase[shortURL])
  const longURL = urlDatabase[shortURL].longURL;
  //console.log("shortURL2", urlDatabase[shortURL] )
  console.log("LongURL 1", longURL)

  res.redirect(longURL);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});
