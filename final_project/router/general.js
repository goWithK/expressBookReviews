const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


let getBookList = (data) => new Promise((resolve, reject) => {
  if (data) {
    resolve(data)
  } else {
    reject('Book list is empty!!!')
  }
})
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBookList(books)
  .then(books => res.send(JSON.stringify({ books }, null, 4)))
  .catch(message => res.send(message));
});

let getBook = (data, isbn) => new Promise((resolve, reject) => {
  if (data[isbn]) {
    resolve(data[isbn])
  } else {
    reject('Book does not exist!!!')
  }
})
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBook(books, isbn)
  .then(data => res.send(JSON.stringify({data}, null, 4)))
  .catch(message => res.send(message))
});

let getAuthor = (data, authorName) => new Promise((resolve, reject) => {
  if (data){
    let filtered_books = [];
    Object.keys(data).forEach((isbn, book) => {
      if (data[isbn].author === authorName) { filtered_books.push(data[isbn]) }
    });
    resolve(filtered_books)
  } else {
    reject('Book does not exist!!!')
  }
})
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getAuthor(books, author)
  .then(data => res.send(JSON.stringify({data}, null, 4)))
  .catch(message => res.send(message))
});

let getTitle = (data, title) => new Promise((resolve, reject) => {
  if (data){
    let filtered_books = [];
  Object.keys(books).forEach((isbn, book) => {
    if (books[isbn].title === title) { filtered_books.push(books[isbn]) }
  });
    resolve(filtered_books)
  } else {
    reject('Book does not exist!!!')
  }
})
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getTitle(books, title)
  .then(data => res.send(JSON.stringify({data}, null, 4)))
  .catch(message => res.send(message))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  res.send(JSON.stringify({ review }, null, 4));
});

module.exports.general = public_users;
