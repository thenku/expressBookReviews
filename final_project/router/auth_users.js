const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//Function to check if the user is authenticated
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }


  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} =  req.query;
  const {authorization} = req.session;
  const {username} = authorization;

  if(review && username){
    let b = null;
    for (const key in books) {
        const book = books[key];
        if(book.isbn == isbn){
          b = book;
          break;
      }
    }
    if(b){
      b.reviews[username] = review;
      return res.status(200).json(b)
    }
  }
  return res.status(404).json({message: "no book found"});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {authorization} = req.session;
  const {username} = authorization;
  const {isbn} = req.params;
  if(username){
    let b = null;
    for (const key in books) {
        const book = books[key];
        if(book.isbn == isbn){
          b = book;
          break;
      }
    }
    if(b && b.reviews[username]){
      delete b.reviews[username];
      return res.status(200).json(b)
    }
  }
  return res.status(404).json({message: "no book found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
