app.get("/dashboard", (req, res) => {
  const dir = path.join(__dirname, "logs");

  if (!fs.existsSync(dir)) {
    return res.send("<h2>No logs found</h2>");
  }

  const files = fs.readdirSync(dir).sort((a, b) => b.localeCompare(a));

  let rows = "";

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    rows += `
      <tr>
        <td>${data.ip}</td>
        <td>${data.time}</td>
        <td>${data.data?.userAgent || "N/A"}</td>
        <td><a href="/log/${file}" target="_blank">View</a></td>
      </tr>
    `;
  });

  const html = `
  <html>
  <head>
    <title>Dashboard</title>
    <style>
      body { font-family: Arial; background:#111; color:#fff; padding:20px; }
      table { width:100%; border-collapse: collapse; }
      th, td { border:1px solid #444; padding:10px; }
      th { background:#222; }
      a { color:#4fc3f7; }
    </style>
  </head>
  <body>

    <h1>📊 Logs Dashboard</h1>

    <table>
      <tr>
        <th>IP</th>
        <th>Time</th>
        <th>User Agent</th>
        <th>Details</th>
      </tr>
      ${rows}
    </table>

  </body>
  </html>
  `;

  res.send(html);
});
