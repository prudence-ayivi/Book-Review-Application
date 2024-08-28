const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid 
return users.some(user => user.username === username);
};

// Helper function to check if the username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate JWT access token
  let accessToken = jwt.sign(
    { username },
    'access', 
    { expiresIn: 60 * 60 }
  );

  // Store access token in session
  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here 
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username; // Assume `req.user` is populated after JWT authentication

  if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
  }

  // Check if books is an object or array
  const book = books[isbn]; // Assume `books` is an object where the key is the ISBN

  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  // If the user already reviewed the book, modify the existing review
  if (book.reviews[username]) {
      book.reviews[username] = review;
  } else {
      // Otherwise, add a new review
      book.reviews[username] = review;
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Assume `req.user` is populated after JWT authentication

  // Check if books is an object or array
  const book = books[isbn]; // Assume `books` is an object where the key is the ISBN

  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
      return res.status(404).json({ message: "Review not found for the user" });
  }

  // Delete the review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
