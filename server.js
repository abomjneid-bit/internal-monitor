const express = require("express");
const path = require("path");

const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/log", (req, res) => {

  console.log("REAL IP:", req.ip);

  console.log("HEADERS:", req.headers);

  console.log("DATA:", req.body);

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Running...");
});
