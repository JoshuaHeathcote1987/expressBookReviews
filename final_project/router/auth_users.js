const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username: "username",
  password: "password"
},
];

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Please provide us with the username and password." });
  }

  const userExists = users.filter((user) => user.username == username && user.password == password);

  if (userExists) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("You have logged in successfully!");
  }

  if (!userExists) {
    return res.status(208).json({ message: "Incorrect username and password, please try again." })
  }
});

regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const book = books[isbn];
  book.reviews = { 'post': review };
  return res.send(book);
});

regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  return res.send(username);
});

module.exports.authenticated = regd_users;
module.exports.users = users;
