// app.js or index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookRoutes = require("./routes/BookRoutes");
const authRoutes = require("./routes/auth");

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);


app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
