const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.set("trust proxy", true);

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const VisitSchema = new mongoose.Schema({
  ip: String,
  time: String,
  headers: Object,
  data: Object
});

const Visit = mongoose.model("Visit", VisitSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/log", async (req, res) => {

  const logData = {
    ip: req.ip,
    time: new Date().toISOString(),
    headers: req.headers,
    data: req.body
  };

  console.log(logData);

  await Visit.create(logData);

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Running...");
});
