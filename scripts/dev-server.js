const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  if (urlPath === "/api/ads" || urlPath === "/api/ads.php") {
    const adsDir = path.join(root, "assets", "ads");
    fs.readdir(adsDir, (err, files = []) => {
      const images = err ? [] : files
        .filter((file) => [".png", ".jpg", ".jpeg", ".webp"].includes(path.extname(file).toLowerCase()))
        .map((file) => `/assets/ads/${file}`);
      res.writeHead(200, { "Content-Type": mime[".json"] });
      res.end(JSON.stringify(images));
    });
    return;
  }

  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (!statErr && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        fs.readFile(path.join(root, "index.html"), (fallbackErr, fallback) => {
          if (fallbackErr) {
            res.writeHead(404);
            res.end("Not found");
            return;
          }

          res.writeHead(200, { "Content-Type": mime[".html"] });
          res.end(fallback);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(content);
    });
  });
});

server.listen(port, () => {
  console.log(`APP_Maristas local: http://localhost:${port}`);
});
