const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: `User ${username} has successfully been registered` });
    }
    else {
      return res.status(400).json({ message: `User ${username} is already registered` });
    }
  }

  if (!username || !password) {
    return res.status(404).json({ message: "You must provide a username and password" });
  }
});

public_users.get('/', (req, res, next) => {
  (async () => {
    const data = await Promise.resolve({ books });
    return res.send(data);
  })().catch(next);
});

public_users.get('/isbn/:isbn', function (req, res, next) {
  (async () => {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    const data = await Promise.resolve({ book });
    return res.send(data);
  })().catch(next);
});

public_users.get('/author/:author', function (req, res, next) {
  (async () => {
    const author = req.params.author;
    const values = Object.values(books);
    const book = values.filter((book) => { return book.author == author });
    const data = await Promise.resolve({ book });
    return res.send(data);
  })().catch(next);
});

public_users.get('/title/:title', function (req, res, next) {
  (async () => {
    const title = req.params.title;
    const values = Object.values(books);
    const book = values.filter((book) => { return book.title == title });
    const data = await Promise.resolve({ book });
    res.send(data);
  })().catch(next);
});

public_users.get('/review/:isbn', function (req, res, next) {
  (async () => {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    res.send(book.reviews);
  })().catch(next);
});

module.exports.general = public_users;