const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const axios = require("axios");

router.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const savedBook = await Book.create(req.body);
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/media", auth, upload.single("bookFile"), async (req, res) => {
  try {
    const savedBook = await Book.create({
      ...req.body,
      filePath: req.file.path,
    });
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
