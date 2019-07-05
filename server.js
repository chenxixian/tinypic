const express = require("express");
const upload = require("multer")({ dest: "." });
const path = require("path");
const fs = require("fs");
//const pako = require('pako'); //
//const pic = require('./static/picdiet.js');
const port = 3000;
//GLOBAL.document = new JSDOM(html).window.document;

let app = express();

app.set("port", port);
app.use(express.static(path.join(__dirname, "static")));

app.get("/index.html", (req, res) => {
  res.redirect("index.html");
});

app.get("/blob.jpg", (req, res) => {
  fs.readFile("blob.jpg", function(err, data) {
    if (err) {
      res.end("file not exist");
    } else {
      res.writeHeader(200, { "Context-Type": "text/html" });
      res.end(data);
    }
  });
});

app.post("/upload", upload.single("test-upload"), (req, res) => {
  // 没有附带文件
  if (!req.file) {
    res.json({ ok: false });
    return;
  }

  // 输出文件信息
  console.log("====================================================");
  console.log("fieldname: " + req.file.fieldname);
  console.log("originalname: " + req.file.originalname);
  console.log("encoding: " + req.file.encoding);
  console.log("mimetype: " + req.file.mimetype);
  console.log("size: " + (req.file.size / 1024).toFixed(2) + "KB");
  console.log("destination: " + req.file.destination);
  console.log("filename: " + req.file.filename);
  console.log("path: " + req.file.path);

  // 重命名文件
  let oldPath = path.join(__dirname, req.file.path);
  let newPath = path.join(__dirname, "blob.jpg");
  fs.rename(oldPath, newPath, err => {
    if (err) {
      res.json({ ok: false });
      console.log(err);
    } else {
      res.json({ ok: true });
    }
  });
});

app.listen(port, () => {
  console.log("[Server] localhost:" + port);
});
