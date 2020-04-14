const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
  // "shortURL": "longURL"
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
  let templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = {shortURL, longURL: urlDatabase[shortURL]};
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


function generateRandomString() {
  let tinyURL = Math.random().toString(36).substring(6);
return tinyURL
};

