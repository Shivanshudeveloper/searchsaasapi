const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
// Route Files
const routes = require("./routes/api");
const app = express();
app.use(cors());
app.use(express.json());
// Routing for API Service
app.use("/api", routes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
