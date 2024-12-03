const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let repeatedUsers = users.filter((user)=>{return user.username === username});
  if (repeatedUsers.length == 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error with username or password" });
  }

  if (authenticatedUser(username, password)) {

      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("You have successfully logged in");
  } else {
      return res.status(208).json({ message: "Error with username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const ISBN = req.params.isbn;
  const username = req.session.authorization["username"];
  books[ISBN].reviews[username] = review;
  return res.status(200).send("the review of the book " + books[ISBN].title + " has been added/updated successfully");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization["username"];
  delete books[ISBN].reviews[username];
  return res.status(200).send("the review of the book " + books[ISBN].title + " added by " + username + " has been deleted successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
