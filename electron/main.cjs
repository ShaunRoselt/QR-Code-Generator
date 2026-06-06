'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { once } = require('node:events');
const { URL } = require('node:url');
const { app, BrowserWindow, shell } = require('electron');

const rootDir = path.join(__dirname, '..');
const appIconPath = path.join(rootDir, 'assets', 'icons', 'app-icon-4096.png');
const defaultRoute = 'home';
const minimumWindowWidth = 980;
const minimumWindowHeight = 720;
let server = null;
let serverOrigin = null;

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

if (process.platform === 'linux') {
    app.setDesktopName('io.github.ShaunRoselt.QRCodeGenerator.desktop');
}

app.setName('QR Code Generator');

function isInsideRoot(filePath) {
    const normalizedRoot = `${path.resolve(rootDir)}${path.sep}`;
    const normalizedPath = path.resolve(filePath);
    return normalizedPath === path.resolve(rootDir) || normalizedPath.startsWith(normalizedRoot);
}

function getContentType(filePath) {
    return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function resolveFilePath(pathname) {
    const decodedPath = decodeURIComponent(pathname || '/');
    const relativePath = decodedPath === '/' ? '/index.html' : decodedPath;
    const resolvedPath = path.resolve(rootDir, `.${relativePath}`);

    if (!isInsideRoot(resolvedPath)) {
        return null;
    }

    try {
        const stats = await fs.stat(resolvedPath);
        if (stats.isFile()) {
            return resolvedPath;
        }

        if (stats.isDirectory()) {
            const indexPath = path.join(resolvedPath, 'index.html');
            const indexStats = await fs.stat(indexPath);
            return indexStats.isFile() ? indexPath : null;
        }
    } catch {
        return null;
    }

    return null;
}

function createStaticServer() {
    return http.createServer(async (request, response) => {
        try {
            const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
            const filePath = await resolveFilePath(requestUrl.pathname);

            if (!filePath) {
                response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end('Not found');
                return;
            }

            const headers = {
                'Cache-Control': 'no-store',
                'Content-Type': getContentType(filePath)
            };

            response.writeHead(200, headers);
            if (request.method === 'HEAD') {
                response.end();
                return;
            }

            response.end(await fs.readFile(filePath));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end(error instanceof Error ? error.message : 'Internal server error');
        }
    });
}

async function ensureStaticServer() {
    if (server && serverOrigin) {
        return serverOrigin;
    }

    server = createStaticServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();

    if (!address || typeof address === 'string') {
        throw new Error('Could not determine desktop server address.');
    }

    serverOrigin = `http://127.0.0.1:${address.port}`;
    return serverOrigin;
}

function closeStaticServer() {
    if (!server) {
        return;
    }

    const currentServer = server;
    server = null;
    serverOrigin = null;
    currentServer.close();
}

function isAllowedPopupUrl(url) {
    return url.startsWith('data:') || url.startsWith('blob:') || Boolean(serverOrigin && url.startsWith(serverOrigin));
}

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: minimumWindowWidth,
        minHeight: minimumWindowHeight,
        show: false,
        autoHideMenuBar: true,
        backgroundColor: '#16181d',
        icon: appIconPath,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (isAllowedPopupUrl(url)) {
            return { action: 'allow' };
        }

        void shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (isAllowedPopupUrl(url)) {
            return;
        }

        event.preventDefault();
        void shell.openExternal(url);
    });

    return mainWindow;
}

app.whenReady().then(async () => {
    const origin = await ensureStaticServer();
    const startUrl = new URL('/index.html', origin);
    startUrl.searchParams.set('page', defaultRoute);

    const mainWindow = createMainWindow();
    await mainWindow.loadURL(startUrl.toString());

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length > 0) {
            return;
        }

        const nextWindow = createMainWindow();
        await nextWindow.loadURL(startUrl.toString());
    });
});

app.on('before-quit', () => {
    closeStaticServer();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});