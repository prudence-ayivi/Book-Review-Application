const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here 
  const { username, password } = req.body; // Using req.body instead of req.query for POST requests

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  if (users.find((user) => user.username === username)) {
    return res.status(400).send("Username already exists");
  }

  users.push({
    username: username,
    password: password,
  });

  res.status(201).send(`The user ${username} has been registered successfully!`);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here 
  res.send(JSON.stringify({books}, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here 
  const isbn = req.params.isbn;
  const book = books[isbn]
  //let filtered_books = books.filter((book) => book.isbn === isbn);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here 
  // Extract the author name parameter from the request URL 
  const author = req.params.author;

  let booksArray = Object.values(books);

    let filteredBooks = booksArray.filter(book => book.author === author);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "Books by the specified author not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here 
  // Extract the title parameter from the request URL
  const title = req.params.title;
  let booksArray = Object.values(books);
  // Filter the books array to find books whose title matches the extracted title parameter
  let filteredBooks = booksArray.filter(book => book.title === title);

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
  } else {
      return res.status(404).json({ message: "Books with this title not found" });
  }    
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here 
  const isbn = req.params.isbn;
  // Find the book with the provided ISBN using the filter method
  const key = parseInt(isbn);

    // Check if the key exists in the books object
    if (books[key]) {
        const book = books[key];
        
        // Check if reviews exist
        if (Object.keys(book.reviews).length > 0) {
            res.send(book.reviews);
        } else {
            res.status(200).json({ message: "No reviews available for this book." });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
