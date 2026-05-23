const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();

app.set("trust proxy", true);
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const VisitSchema = new mongoose.Schema({
  ip: String,
  time: String,
  headers: Object,
  data: Object
});

const Visit = mongoose.model("Visit", VisitSchema);

/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   LOG VISITS
========================= */

app.post("/log", async (req, res) => {

  const logData = {
    ip: req.ip,
    time: new Date().toISOString(),
    headers: req.headers,
    data: req.body
  };

  console.log(logData);

  // حفظ في MongoDB
  try {
    await Visit.create(logData);
  } catch (err) {
    console.log("Mongo save error:", err);
  }

  // حفظ ملفات محلية (اختياري)
  const dir = path.join(__dirname, "logs");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.json`;

  fs.writeFileSync(
    path.join(dir, filename),
    JSON.stringify(logData, null, 2)
  );

  res.sendStatus(200);
});

/* =========================
   DASHBOARD (MOBILE FRIENDLY)
========================= */

app.get("/dashboard", async (req, res) => {

  const visits = await Visit.find().sort({ _id: -1 }).limit(100);

  let html = `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
      body { font-family: Arial; background:#111; color:#fff; padding:10px; }
      .card { background:#222; margin:10px 0; padding:10px; border-radius:8px; }
      .ip { color:#4fc3f7; font-weight:bold; }
      .time { color:#aaa; font-size:12px; }
    </style>
  </head>
  <body>

  <h2>📊 Visits Dashboard</h2>
  `;

  visits.forEach(v => {
    html += `
      <div class="card">
        <div class="ip">IP: ${v.ip}</div>
        <div class="time">${v.time}</div>
        <div>UserAgent: ${v.data?.userAgent || ""}</div>
        <div>Language: ${v.data?.language || ""}</div>
      </div>
    `;
  });

  html += `</body></html>`;

  res.send(html);
});

/* =========================
   START SERVER
========================= */

app.listen(process.env.PORT || 3000, () => {
  console.log("Running...");
});
