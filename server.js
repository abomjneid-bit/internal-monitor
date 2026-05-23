const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("trust proxy", true);
app.use(express.json());

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// تسجيل الزيارات في ملفات
app.post("/log", (req, res) => {

  const logData = {
    ip: req.ip,
    time: new Date().toISOString(),
    headers: req.headers,
    data: req.body
  };

  console.log(logData);

  // إنشاء مجلد logs
  const dir = path.join(__dirname, "logs");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // اسم ملف لكل زيارة
  const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.json`;

  fs.writeFileSync(
    path.join(dir, filename),
    JSON.stringify(logData, null, 2)
  );

  res.sendStatus(200);
});

// تشغيل السيرفر
app.listen(process.env.PORT || 3000, () => {
  console.log("Running...");
});
