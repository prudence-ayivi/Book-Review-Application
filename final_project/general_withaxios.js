const express = require('express'); 
const axios = require('axios');

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
public_users.get('/', async function (req, res) {
  //Write your code here 
  try {
    const response = await axios.get('https://api.example.com/books'); // Replace with actual API URL if needed
    const booksData = response.data;
    res.status(200).json(booksData);
} catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here 
  const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://api.example.com/books/${isbn}`); // Replace with actual API URL if needed
        const book = response.data;

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here 
  const author = req.params.author;
    try {
        const response = await axios.get('https://api.example.com/books'); // Replace with actual API URL if needed
        const booksData = response.data;
        const filteredBooks = booksData.filter(book => book.author === author);

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "Books by the specified author not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here 
  const title = req.params.title;
    try {
        const response = await axios.get('https://api.example.com/books'); // Replace with actual API URL if needed
        const booksData = response.data;
        const filteredBooks = booksData.filter(book => book.title === title);

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "Books with this title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
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
