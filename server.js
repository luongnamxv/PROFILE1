const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000; 

const server = http.createServer((req, res) => {
  
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  // Lấy phần mở rộng của file
  const ext = path.extname(filePath);

  // Xác định loại MIME (Content-Type)
  let contentType = "text/html";
  switch (ext) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "application/javascript";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
  }

  // Đọc và trả về nội dung file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Không tìm thấy file
        fs.readFile(path.join(__dirname, "404.html"), (err404, content404) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content404 || "404 Not Found");
        });
      } else {
        // Lỗi server khác
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Thành công: trả file
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

// Lắng nghe kết nối tại PORT
server.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
