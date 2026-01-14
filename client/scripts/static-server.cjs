const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = process.env.FRONTEND_ROOT || '/opt/postdoctor/client/current';
const host = process.env.FRONTEND_HOST || '127.0.0.1';
const port = parseInt(process.env.FRONTEND_PORT || '4173', 10);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json; charset=utf-8',
};

const safeJoin = (base, target) => {
  const targetPath = path.normalize(path.join(base, target));
  if (!targetPath.startsWith(base)) return null;
  return targetPath;
};

const serveFile = (filePath, res, cacheControl) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' };
    if (cacheControl) {
      headers['Cache-Control'] = cacheControl;
    }
    res.writeHead(200, headers);
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const filePath = safeJoin(rootDir, urlPath === '/' ? '/index.html' : urlPath);

  if (!filePath) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const cacheControl = urlPath.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=600';
      return serveFile(filePath, res, cacheControl);
    }
    const indexPath = safeJoin(rootDir, '/index.html');
    if (!indexPath) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    serveFile(indexPath, res, 'no-cache');
  });
});

server.listen(port, host, () => {
  console.log(`Frontend server running at http://${host}:${port}`);
});
