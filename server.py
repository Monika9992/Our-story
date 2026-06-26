import http.server
import socketserver
import os

os.chdir(r'C:\Users\Slien\Documents\Codex\2026-06-26\c\story-website')

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def guess_type(self, path):
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

with socketserver.TCPServer(('', 8080), MyHandler) as httpd:
    print('Server running at http://localhost:8080')
    httpd.serve_forever()
