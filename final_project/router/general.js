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
  //Using a Promise to simulate an asynchronous operation 
  new Promise((resolve, reject) => {
    resolve({ books });
})
.then((bookList) => {
    res.status(200).json(bookList);
})
.catch((error) => {
    res.status(500).json({ message: "Error retrieving books", error });
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here 
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
        resolve(book);
    } else {
        reject("Book not found");
    }
})
.then((book) => {
    res.status(200).json(book);
})
.catch((error) => {
    res.status(404).json({ message: error });
});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

    // Using a Promise to simulate an asynchronous operation
    new Promise((resolve, reject) => {
        let booksArray = Object.values(books);
        let filteredBooks = booksArray.filter(book => book.author === author);
        
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Books by the specified author not found");
        }
    })
    .then((filteredBooks) => {
        res.status(200).json(filteredBooks);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

    // Using a Promise to simulate an asynchronous operation
    new Promise((resolve, reject) => {
        let booksArray = Object.values(books);
        let filteredBooks = booksArray.filter(book => book.title === title);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Books with this title not found");
        }
    })
    .then((filteredBooks) => {
        res.status(200).json(filteredBooks);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
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
