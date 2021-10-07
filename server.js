//const BlogPost=require('./models/BlogPost')
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes/api");

const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "HI" });
});

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use("/api", routes);

app.listen(PORT, console.log(`Server is running at ${PORT}`));
