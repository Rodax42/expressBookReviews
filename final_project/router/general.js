const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "You have been registered succesfully!"});
    } else {
        return res.status(404).json({message: "This user already exist"});
    }
  }
  return res.status(404).json({message: "Error with username or password"});
});

public_users.get('/',function (req, res) {
  let bookList = new Promise((resolve,reject)=>{
    try{
      let list = JSON.stringify(books,null,4);
      resolve(list)
    } catch (err) {
      reject(err);
    }
  })
  bookList.then((bookList)=>{
    res.send(bookList);
  })
});

public_users.get('/isbn/:isbn',function (req, res) {
  let ISBNPromise = new Promise((resolve,reject)=>{
    try{
      const ISBN = req.params.isbn;
      let book = books[ISBN];
      resolve(book)
    } catch (err) {
      reject(err);
    }
  })
  ISBNPromise.then((book)=>{
    res.send(book);
  })
 });
  

public_users.get('/author/:author',function (req, res) {
  let authorPromise = new Promise((resolve,reject)=>{
    try{
      const author = req.params.author;
      var book;
      for(const key in books){
        if(books[key].author == author){
          book = books[key];
          break;
        }
      }
      resolve(book)
    } catch (err) {
      reject(err);
    }
  })
  authorPromise.then((book)=>{
    res.send(book);
  })
});


public_users.get('/title/:title',function (req, res) {
  let titlePromise = new Promise((resolve,reject)=>{
    try{
      const title = req.params.title;
      var book;
      for(const key in books){
        if(books[key].title == title){
          book = books[key];
          break;
        }
      }
      resolve(book)
    } catch (err) {
      reject(err);
    }
  })
  titlePromise.then((book)=>{
    res.send(book);
  })
});


public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const reviews = books[ISBN].reviews;
  res.send(reviews);
});

module.exports.general = public_users;
