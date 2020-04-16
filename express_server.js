const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
  // "shortURL": "longURL"
};

const users ={
  "userRandomID": {
    id: "userRandom",
    email: "user@example.com",
    password: "password1"
  },
  "user2RandomID": {
    username: "user2RandomID",
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

function existingUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if(email === "" && password === ""){
    return false;
  } 
  for(const id in users){
    if(users[id].email === email){
      return false
    }
   // } else {
    //  const id = generateRandomId();
     // users[id] = { id, email, password };
     // console.log(users)
   // }
  }
  return true;
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
  const userId = req.cookies.id;
  const user = users[userId];
  let templateVars = { user };
  res.render("urls_new", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});
app.post("/urls/:shortURL/edit", (req, res) => {  
  const { shortURL } = req.params;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls")
});
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls")
});
app.post("/urls/register", (req, res) => {
  if (existingUser(req, res)) {
    const email = req.body.email;
    const password = req.body.password;
    const id = generateRandomId();
    users[id] = { id, email, password };
    res.cookie("id", id);
    res.redirect("/urls");
  } else{
  res.status(400).send("error")
  };
  
});  
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.cookies.id;
  const user = users[userId];
  let templateVars = {shortURL, longURL: urlDatabase[shortURL], user};
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  urlDatabase[generateRandomString()] = req.body["longURL"];
  res.redirect("/urls");
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});




