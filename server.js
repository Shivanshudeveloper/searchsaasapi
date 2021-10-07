const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const routes = require("./routes/api");

const app = express();
dotenv.config();

app.use(cors());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome !!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
