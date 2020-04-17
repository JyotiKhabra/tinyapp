
//Required Packages
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['71NY499'],}));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});

//Exported helperfunctions
const { getUserByEmail, urlsForUser } = require('./helper_functions/finduserhelpers.js');
const { generateRandomString, generateRandomId } = require('./helper_functions/generatestringshelpers.js');

//Databases
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ481W" },
  "9sm5xk": { longURL: "http://www.google.ca", userID: "aJ481W" }
};

const users = {
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
};


app.get("/urls.json",(req, res) => {
  res.json(urlDatabase);
});

//routes for login/logout//

app.post("/urls/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (user && bcrypt.compareSync(password, user.hashedPassword)) {
    req.session.id = user.id;
    res.redirect("/urls");
  } else {
    res.redirect("/urls/login");
  }
});

app.get("/urls/login", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];
  let templateVars = { user };
  res.render("urls_login", templateVars);
});

app.post("/logout", (req, res) => {
  //req.session.id = undefined
  req.session.id = null;
  res.redirect("/urls/login");
});


//routes for homepage//

app.get("/urls", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];
  const usersID = urlsForUser(userId, urlDatabase);
  let templateVars = { user, urls: usersID };
  //if not user
  if (!user) {
    res.redirect("urls/login");
  }
  //only display urls belong to id
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const id = req.session.id;
  //If user is not logged in
  if (!id) {
    res.status(403).send("You are not logged in!");
  } else if (id) {
    urlDatabase[generateRandomString()] = {longURL : req.body.longURL, userID: id };
    res.redirect("/urls");
  } else {
    res.status(403).send("You are not logged in!");
  }
});

//routes for registration//

app.get("/urls/register", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];
  let templateVars = { user };
  res.render("urls_register", templateVars);
});

app.post("/urls/register", (req, res) => {
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = req.body.email;
  //if no password and user exists return error
  if (getUserByEmail(email, users) || password === "") {
    res.status(403).send("error");
    //else create new user and generate id
  } else {
    const id = generateRandomId();
    users[id] = { id, email, hashedPassword };
    req.session.id = id;
    res.redirect("/urls");
  }
});

//routes for new//

app.get("/urls/new", (req, res) => {
  const email = req.query.email;
  const user = getUserByEmail(email, users);
  if (!user) {
    res.redirect("/urls/login");
  } else {
    req.session.id = user.id;
    let templateVars = { user };
    res.render("urls_new", templateVars);
  }
});

//routes editing and deleting// 

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const userId = req.session.id;
  if (userId === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("You are not logged in!");
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.id;
  //If user is not logged in
  if (!userId) {
    res.status(403).send("You are not logged in!");
  } else if (userId === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("You are not authorized to change this URL!");
  }
});

//routes for :shortURL//

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const userId = req.session.id;
    const user = users[userId];
    const longURL = urlDatabase[shortURL].longURL;
    let templateVars = {shortURL, longURL, user};
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls");
  }
});
