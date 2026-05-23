const express = require("express");

const app = express();

app.use(express.json());

app.post("/log", (req, res) => {

  console.log("IP:", req.ip);
  console.log("DATA:", req.body);

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
