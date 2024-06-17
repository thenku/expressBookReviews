const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const {isbn} = req.params;
  let b = null;
  for (const key in books) {
      const book = books[key];
      if(book.isbn == isbn){
        b = book;
        break;
    }
  }
  if(b){
    return res.status(200).json(b)
  }
  return res.status(404).json({message: "no book found"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const {author} = req.params;
  let ans = [];
  for (const key in books) {
      const book = books[key];
      if(book.author == author){
        ans.push(book);
    }
  }
  if(ans.length > 0){
    return res.status(200).json(ans)
  }
  return res.status(200).json({message: "author not found"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const {title} = req.params;
  let ans = [];
  for (const key in books) {
      const book = books[key];
      if(book.title == title){
        ans.push(book);
    }
  }
  if(ans.length > 0){
    return res.status(200).json(ans)
  }
  return res.status(200).json({message: "title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  let review = null;
  for (const key in books) {
      const book = books[key];
      if(book.isbn == isbn){
        review = book.reviews;
        break;
    }
  }
  if(review){
    return res.status(200).json(review)
  }
  return res.status(300).json({message: "no reviews for isbn found"});
});

module.exports.general = public_users;
