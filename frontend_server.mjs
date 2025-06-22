import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const mimeTypes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

const server = createServer(async (req, res) => {
  if (req.url === '/api/message') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from the server!' }));
    return;
  }

  // Static file handling
  const filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
  const resolvedPath = resolve(filePath);

  // Prevent path traversal
  if (!resolvedPath.startsWith(resolve('.'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (!existsSync(resolvedPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  try {
    const data = await readFile(resolvedPath);
    const ext = extname(resolvedPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
    console.error('Error serving file:', err);
  }
});

server.listen(3001, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:3001');
});

