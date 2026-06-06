#!/usr/bin/env node

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ASSETS_ROOT = path.resolve(__dirname);
const REPO_ROOT = path.resolve(ASSETS_ROOT, '..');
const OUTPUT_DIR = path.join(ASSETS_ROOT, 'trailer');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const FINAL_VIDEO_PATH = path.join(OUTPUT_DIR, 'trailer.mp4');
const APP_ENTRY = 'index.html';
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_FPS = 60;
const VIDEO_BITRATE = '12000k';
const VIDEO_MAXRATE = '12000k';
const VIDEO_BUFSIZE = '24000k';
const AUDIO_BITRATE = '192k';
const MAX_TRAILER_DURATION_SECONDS = 120;
const INTERNAL_ELECTRON_FLAGS = new Set(['--no-sandbox', '--disable-setuid-sandbox']);

function resolveElectronBinary() {
  try {
    const electronModule = require('electron');
    if (typeof electronModule === 'string' && electronModule) {
      return electronModule;
    }
  } catch {
    // Fall back to the workspace-local binary path when the package is not resolvable.
  }

  return path.join(
    REPO_ROOT,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'electron.cmd' : 'electron'
  );
}

const ELECTRON_BIN = resolveElectronBinary();

const SCENES = [
  { id: '01_home_overview', page: 'home', theme: 'dark', language: 'en', duration: 2.8, expectQr: false, waitMs: 420 },
  {
    id: '02_url_qr',
    page: 'url',
    theme: 'dark',
    language: 'en',
    duration: 3.0,
    waitMs: 480,
    controls: [
      { id: 'urlInput', value: 'https://qrcode.apps.shaunroselt.com/' },
      { id: 'errorCorrection', value: 'H' }
    ]
  },
  {
    id: '03_text_qr',
    page: 'text',
    theme: 'dark',
    language: 'en',
    duration: 2.8,
    waitMs: 460,
    controls: [
      { id: 'textInput', value: 'Table 12 menu\nScan to order and pay.' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '04_email_qr',
    page: 'email',
    theme: 'dark',
    language: 'en',
    duration: 2.8,
    waitMs: 460,
    controls: [
      { id: 'emailInput', value: 'hello@shaunroselt.com' },
      { id: 'subjectInput', value: 'QR campaign quote' },
      { id: 'bodyInput', value: 'Need branded QR codes for packaging and storefront displays.' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '05_phone_qr',
    page: 'phone',
    theme: 'dark',
    language: 'en',
    duration: 2.4,
    waitMs: 420,
    controls: [
      { id: 'phoneInput', value: '+27123456789' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '06_wifi_qr',
    page: 'wifi',
    theme: 'dark',
    language: 'en',
    duration: 3.0,
    waitMs: 500,
    controls: [
      { id: 'ssidInput', value: 'Cafe Guest WiFi' },
      { id: 'passwordInput', value: 'scanme2026' },
      { id: 'encryptionInput', value: 'WPA' },
      { id: 'hiddenInput', checked: false },
      { id: 'errorCorrection', value: 'H' }
    ]
  },
  {
    id: '07_location_qr',
    page: 'location',
    theme: 'dark',
    language: 'en',
    duration: 2.8,
    waitMs: 460,
    controls: [
      { id: 'latitudeInput', value: '-33.9249' },
      { id: 'longitudeInput', value: '18.4241' },
      { id: 'labelInput', value: 'Cape Town Studio' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '08_event_qr',
    page: 'event',
    theme: 'dark',
    language: 'en',
    duration: 3.0,
    waitMs: 520,
    controls: [
      { id: 'titleInput', value: 'QR Product Launch' },
      { id: 'locationInput', value: 'Cape Town Convention Centre' },
      { id: 'descriptionInput', value: 'Live demos, print-ready exports, and branded QR campaigns.' },
      { id: 'startInput', value: '2026-08-14T18:30', event: 'change' },
      { id: 'endInput', value: '2026-08-14T21:00', event: 'change' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '09_appstore_qr',
    page: 'appstore',
    theme: 'dark',
    language: 'en',
    duration: 2.8,
    waitMs: 460,
    controls: [
      { id: 'platformSelect', value: 'googleplay' },
      { id: 'appIdInput', value: 'io.github.shaunroselt.qrcodegenerator' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '10_social_qr',
    page: 'social',
    theme: 'dark',
    language: 'en',
    duration: 2.8,
    waitMs: 500,
    controls: [
      { id: 'platformSelect', value: 'instagram' },
      { id: 'usernameInput', value: 'shaunroselt' },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '11_vcard_qr',
    page: 'vcard',
    theme: 'dark',
    language: 'en',
    duration: 3.2,
    waitMs: 520,
    controls: [
      { id: 'firstNameInput', value: 'Shaun' },
      { id: 'lastNameInput', value: 'Roselt' },
      { id: 'organizationInput', value: 'QR Code Generator' },
      { id: 'phoneInput', value: '+27123456789' },
      { id: 'emailInput', value: 'hello@shaunroselt.com' },
      { id: 'websiteInput', value: 'https://qrcode.apps.shaunroselt.com/' },
      { id: 'cityInput', value: 'Cape Town' },
      { id: 'countryInput', value: 'South Africa' },
      { id: 'errorCorrection', value: 'H' }
    ]
  },
  { id: '12_settings_dark', page: 'settings', theme: 'dark', language: 'en', duration: 2.4, expectQr: false, waitMs: 320 },
  { id: '13_settings_light', page: 'settings', theme: 'light', language: 'en', duration: 2.4, expectQr: false, waitMs: 320 },
  {
    id: '14_url_german',
    page: 'url',
    theme: 'light',
    language: 'de',
    duration: 2.8,
    waitMs: 480,
    controls: [
      { id: 'urlInput', value: 'https://shaunroselt.com/de/kontakt' },
      { id: 'errorCorrection', value: 'H' }
    ]
  },
  {
    id: '15_wifi_german',
    page: 'wifi',
    theme: 'light',
    language: 'de',
    duration: 2.8,
    waitMs: 500,
    controls: [
      { id: 'ssidInput', value: 'Studio Gast WLAN' },
      { id: 'passwordInput', value: 'scanme2026' },
      { id: 'encryptionInput', value: 'WPA' },
      { id: 'hiddenInput', checked: false },
      { id: 'errorCorrection', value: 'Q' }
    ]
  },
  {
    id: '16_url_arabic',
    page: 'url',
    theme: 'dark',
    language: 'ar',
    duration: 2.8,
    waitMs: 500,
    controls: [
      { id: 'urlInput', value: 'https://shaunroselt.com/ar/visit' },
      { id: 'errorCorrection', value: 'H' }
    ]
  },
  {
    id: '17_vcard_arabic',
    page: 'vcard',
    theme: 'dark',
    language: 'ar',
    duration: 3.0,
    waitMs: 520,
    controls: [
      { id: 'firstNameInput', value: 'Shaun' },
      { id: 'lastNameInput', value: 'Roselt' },
      { id: 'organizationInput', value: 'QR Code Generator' },
      { id: 'phoneInput', value: '+27123456789' },
      { id: 'emailInput', value: 'hello@shaunroselt.com' },
      { id: 'websiteInput', value: 'https://qrcode.apps.shaunroselt.com/' },
      { id: 'cityInput', value: 'Cape Town' },
      { id: 'countryInput', value: 'South Africa' },
      { id: 'errorCorrection', value: 'H' }
    ]
  }
];

for (const scene of SCENES) {
  if (!scene.still) scene.still = `stills/${scene.id}.png`;
  if (!scene.clip) scene.clip = `clips/${scene.id}.mp4`;
}

const SCENE_IDS = SCENES.map((scene) => scene.id);

function parseCsvArgument(rawValue, fallbackValues, validValues) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    return [...fallbackValues];
  }

  const selected = rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (selected.length === 0) {
    return [...fallbackValues];
  }

  const unknownValues = selected.filter((value) => !validValues.includes(value));
  if (unknownValues.length > 0) {
    throw new Error(`Unknown values: ${unknownValues.join(', ')}`);
  }

  return selected;
}

function parseArgs(argv) {
  const options = {
    outputDir: OUTPUT_DIR,
    baseUrl: '',
    scenes: [...SCENE_IDS],
    help: false
  };

  for (const arg of argv) {
    if (INTERNAL_ELECTRON_FLAGS.has(arg)) {
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg.startsWith('--output-dir=')) {
      const rawOutputDir = arg.slice('--output-dir='.length).trim();
      options.outputDir = rawOutputDir ? path.resolve(rawOutputDir) : OUTPUT_DIR;
      continue;
    }

    if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length).trim();
      continue;
    }

    if (arg.startsWith('--scenes=')) {
      options.scenes = parseCsvArgument(arg.slice('--scenes='.length), SCENE_IDS, SCENE_IDS);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log('Create a trailer for QR Code Generator.');
  console.log('');
  console.log('Usage: npm run create:trailer -- [options]');
  console.log('');
  console.log('Options:');
  console.log(`  --output-dir=${OUTPUT_DIR}  Override the output directory.`);
  console.log(`  --scenes=${SCENE_IDS.join(',')}  Limit the rendered scenes.`);
  console.log('  --base-url=http://127.0.0.1:4173  Reuse an existing server instead of starting one.');
  console.log('  --help, -h                 Show this help.');
}

function validateTrailerDuration(scenes) {
  const totalDurationSeconds = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  if (totalDurationSeconds > MAX_TRAILER_DURATION_SECONDS) {
    throw new Error(
      `Selected scenes total ${totalDurationSeconds.toFixed(2)}s, which exceeds the ${MAX_TRAILER_DURATION_SECONDS}s limit.`
    );
  }
}

function resolveScenes(options) {
  const scenes = SCENES.filter((scene) => options.scenes.includes(scene.id));
  validateTrailerDuration(scenes);
  return scenes;
}

function isElectronMainProcess() {
  return Boolean(process.versions?.electron) && process.type !== 'renderer';
}

function ensureElectronInstalled() {
  if (!fs.existsSync(ELECTRON_BIN)) {
    throw new Error(`Electron binary not found at ${ELECTRON_BIN}. Run npm install first.`);
  }
}

async function ensureFfmpegInstalled() {
  await runCommand('ffmpeg', ['-version'], { cwd: REPO_ROOT, stdio: 'ignore' });
}

async function ensureCleanOutput(outputDir) {
  await fsp.rm(outputDir, { recursive: true, force: true });
  await fsp.mkdir(path.join(outputDir, 'stills'), { recursive: true });
  await fsp.mkdir(path.join(outputDir, 'clips'), { recursive: true });
}

function createStaticServer(rootDirectory) {
  const mimeTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.gif', 'image/gif'],
    ['.html', 'text/html; charset=utf-8'],
    ['.ico', 'image/x-icon'],
    ['.jpeg', 'image/jpeg'],
    ['.jpg', 'image/jpeg'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.mjs', 'text/javascript; charset=utf-8'],
    ['.png', 'image/png'],
    ['.svg', 'image/svg+xml'],
    ['.ttf', 'font/ttf'],
    ['.txt', 'text/plain; charset=utf-8'],
    ['.webmanifest', 'application/manifest+json; charset=utf-8'],
    ['.woff', 'font/woff'],
    ['.woff2', 'font/woff2'],
    ['.xml', 'application/xml; charset=utf-8']
  ]);

  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const decodedPath = decodeURIComponent(requestUrl.pathname);
      const relativePath = decodedPath === '/'
        ? APP_ENTRY
        : decodedPath.replace(/^\/+/, '');
      const resolvedPath = path.resolve(rootDirectory, relativePath);

      if (!resolvedPath.startsWith(rootDirectory)) {
        response.writeHead(403, { 'Cache-Control': 'no-store' });
        response.end('Forbidden');
        return;
      }

      let stats = null;
      try {
        stats = await fsp.stat(resolvedPath);
      } catch {
        stats = null;
      }

      let filePath = resolvedPath;
      if (stats?.isDirectory()) {
        filePath = path.join(resolvedPath, APP_ENTRY);
      }

      const fileBuffer = await fsp.readFile(filePath);
      const contentType = mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Length': fileBuffer.length,
        'Content-Type': contentType
      });
      response.end(fileBuffer);
    } catch {
      response.writeHead(404, { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
}

async function startStaticServer() {
  const server = createStaticServer(REPO_ROOT);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to determine the temporary trailer server address.');
  }

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  };
}

async function stopStaticServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function getLaunchEnv(extraEnv = {}) {
  const env = {
    ...process.env,
    ...extraEnv
  };
  delete env.ELECTRON_RUN_AS_NODE;
  return env;
}

function buildHelperSource() {
  return `
if (!globalThis.__trailerHelpers) {
  globalThis.__trailerHelpers = (() => {
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const getRouter = () => (typeof router !== 'undefined' ? router : globalThis.router);
    const getThemeManager = () => (typeof themeManager !== 'undefined' ? themeManager : globalThis.themeManager);
    const getI18n = () => (typeof I18n !== 'undefined' ? I18n : globalThis.I18n);

    async function waitFor(getValue, timeoutMs = 8000) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const value = getValue();
        if (value) {
          return value;
        }
        await wait(16);
      }

      throw new Error('Timed out waiting for trailer scene state.');
    }

    function dispatchControlEvents(control, preferredEvent) {
      const eventNames = [];

      if (preferredEvent) {
        eventNames.push(preferredEvent);
      }

      if (control.tagName === 'SELECT' || control.type === 'checkbox' || control.type === 'radio' || control.type === 'datetime-local') {
        eventNames.push('change');
      } else {
        eventNames.push('input');
      }

      eventNames.push('change');

      Array.from(new Set(eventNames)).forEach((eventName) => {
        control.dispatchEvent(new Event(eventName, { bubbles: true }));
      });
    }

    async function waitForRoute(page) {
      const targetRoute = '/' + page;
      return waitFor(() => {
        const routerRef = getRouter();
        if (!routerRef || typeof routerRef.getCurrentRoute !== 'function') {
          return null;
        }

        if (routerRef.getCurrentRoute() !== targetRoute) {
          return null;
        }

        const mainContent = document.getElementById('mainContent');
        return mainContent && mainContent.firstElementChild ? mainContent.firstElementChild : null;
      }, 10000);
    }

    async function setControlValue(controlConfig) {
      const control = await waitFor(() => document.getElementById(controlConfig.id), 5000);

      if (Object.prototype.hasOwnProperty.call(controlConfig, 'checked')) {
        control.checked = Boolean(controlConfig.checked);
      } else {
        control.value = controlConfig.value == null ? '' : String(controlConfig.value);
      }

      dispatchControlEvents(control, controlConfig.event || '');
      await wait(controlConfig.delayMs || 24);
    }

    async function waitForPreview(expectQr) {
      if (!expectQr) {
        await waitFor(() => document.querySelector('#mainContent .content-title'), 5000);
        return;
      }

      await waitFor(() => {
        const qrContainer = document.getElementById('qrcode');
        const downloadOptions = document.getElementById('downloadOptions');
        const previewNode = qrContainer ? qrContainer.firstElementChild : null;

        if (!previewNode || !downloadOptions || downloadOptions.classList.contains('d-none')) {
          return null;
        }

        return previewNode;
      }, 10000);
    }

    async function prepareScene(scene) {
      const targetRoute = '/' + scene.page;
      const routerRef = getRouter();
      const themeRef = getThemeManager();
      const i18nRef = getI18n();

      if (routerRef && typeof routerRef.getCurrentRoute === 'function' && routerRef.getCurrentRoute() !== targetRoute) {
        routerRef.navigate(targetRoute);
      }

      await waitForRoute(scene.page);
      window.scrollTo(0, 0);

      if (scene.theme && themeRef && typeof themeRef.setTheme === 'function') {
        themeRef.setTheme(scene.theme);
        await wait(60);
      }

      if (scene.language && i18nRef && typeof i18nRef.setLanguage === 'function') {
        const currentLanguage = typeof i18nRef.getLanguage === 'function'
          ? i18nRef.getLanguage()
          : null;

        if (currentLanguage !== scene.language) {
          i18nRef.setLanguage(scene.language, { rerender: true });
          await waitForRoute(scene.page);
        }
      }

      for (const controlConfig of scene.controls || []) {
        await setControlValue(controlConfig);
      }

      await waitForPreview(scene.expectQr !== false);
      await wait(scene.waitMs || 320);
    }

    return {
      prepareScene
    };
  })();
}
`;
}

function buildSceneUrl(baseUrl, scene) {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const url = new URL(APP_ENTRY, normalizedBaseUrl);
  url.searchParams.set('page', scene.page);
  return url.toString();
}

async function captureScene(BrowserWindow, options, scene) {
  const targetPath = path.join(options.outputDir, 'stills', `${scene.id}.png`);
  const url = buildSceneUrl(options.baseUrl, scene);
  console.log(`[capture] ${scene.id}: loading ${url}`);

  const win = new BrowserWindow({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    useContentSize: true,
    show: true,
    paintWhenInitiallyHidden: true,
    backgroundColor: '#1f2025',
    webPreferences: {
      contextIsolation: false,
      sandbox: false
    }
  });
  const debuggerSession = win.webContents.debugger;

  try {
    await win.loadURL(url);
    await win.webContents.executeJavaScript(`${buildHelperSource()}\nvoid 0;`);
    await win.webContents.executeJavaScript(`globalThis.__trailerHelpers.prepareScene(${JSON.stringify(scene)}).then(() => undefined)`);

    debuggerSession.attach('1.3');
    await debuggerSession.sendCommand('Page.enable');
    await debuggerSession.sendCommand('Emulation.setDeviceMetricsOverride', {
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: VIDEO_WIDTH,
      screenHeight: VIDEO_HEIGHT
    });

    const { data } = await debuggerSession.sendCommand('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false
    });

    await fsp.writeFile(targetPath, Buffer.from(data, 'base64'));
    console.log(`[capture] ${scene.id}: wrote ${path.relative(options.outputDir, targetPath).replaceAll(path.sep, '/')}`);
  } finally {
    if (debuggerSession.isAttached()) {
      debuggerSession.detach();
    }
    await win.close();
  }
}

async function runElectronCapture() {
  const { app, BrowserWindow } = require('electron');
  const options = parseArgs(process.argv.slice(2));
  const scenes = resolveScenes(options);

  if (!options.baseUrl) {
    throw new Error('Missing --base-url value for Electron capture.');
  }

  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  await app.whenReady();

  try {
    for (const scene of scenes) {
      await captureScene(BrowserWindow, options, scene);
    }
  } finally {
    app.quit();
  }
}

async function spawnElectronCapture(options) {
  await runCommand(
    ELECTRON_BIN,
    [
      __filename,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--output-dir=${options.outputDir}`,
      `--base-url=${options.baseUrl}`,
      `--scenes=${options.scenes.join(',')}`
    ],
    {
      cwd: REPO_ROOT,
      env: getLaunchEnv(),
      stdio: 'inherit'
    }
  );
}

function buildStillPath(outputDir, scene) {
  const stillRel = scene.still || `stills/${scene.id}.png`;
  return path.join(outputDir, stillRel);
}

function buildClipPath(outputDir, scene) {
  const clipRel = scene.clip || `clips/${scene.id}.mp4`;
  return path.join(outputDir, clipRel);
}

async function renderSceneClip(outputDir, scene) {
  const stillPath = buildStillPath(outputDir, scene);
  const clipPath = buildClipPath(outputDir, scene);
  const fadeOutStart = Math.max(0, scene.duration - 0.28).toFixed(2);
  const filterChain = [
    `scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:flags=lanczos`,
    'format=yuv420p',
    'fade=t=in:st=0:d=0.28',
    `fade=t=out:st=${fadeOutStart}:d=0.28`
  ].join(',');

  await runCommand(
    'ffmpeg',
    [
      '-y',
      '-loop', '1',
      '-framerate', String(VIDEO_FPS),
      '-t', String(scene.duration),
      '-i', stillPath,
      '-f', 'lavfi',
      '-t', String(scene.duration),
      '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
      '-vf', filterChain,
      '-r', String(VIDEO_FPS),
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-profile:v', 'high',
      '-level', '4.2',
      '-pix_fmt', 'yuv420p',
      '-x264-params', 'nal-hrd=cbr:force-cfr=1',
      '-b:v', VIDEO_BITRATE,
      '-minrate', VIDEO_BITRATE,
      '-maxrate', VIDEO_MAXRATE,
      '-bufsize', VIDEO_BUFSIZE,
      '-g', String(VIDEO_FPS * 2),
      '-c:a', 'aac',
      '-b:a', AUDIO_BITRATE,
      '-ar', '48000',
      '-ac', '2',
      '-shortest',
      clipPath
    ],
    {
      cwd: REPO_ROOT,
      stdio: 'inherit'
    }
  );
}

function quoteConcatPath(filePath) {
  return `file '${filePath.replaceAll("'", "'\\''")}'`;
}

async function renderTrailer(outputDir, scenes) {
  for (const scene of scenes) {
    await renderSceneClip(outputDir, scene);
  }

  const concatManifestPath = path.join(outputDir, 'clips.txt');
  const concatManifest = `${scenes.map((scene) => quoteConcatPath(buildClipPath(outputDir, scene))).join('\n')}\n`;
  await fsp.writeFile(concatManifestPath, concatManifest, 'utf8');

  await runCommand(
    'ffmpeg',
    [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatManifestPath,
      '-c', 'copy',
      '-movflags', '+faststart',
      path.join(outputDir, path.basename(FINAL_VIDEO_PATH))
    ],
    {
      cwd: REPO_ROOT,
      stdio: 'inherit'
    }
  );
}

async function writeManifest(outputDir, scenes) {
  const totalDurationSeconds = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const manifest = {
    createdAt: new Date().toISOString(),
    outputVideo: path.relative(outputDir, path.join(outputDir, path.basename(FINAL_VIDEO_PATH))).replaceAll(path.sep, '/'),
    resolution: `${VIDEO_WIDTH}x${VIDEO_HEIGHT}`,
    fps: VIDEO_FPS,
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
    targetVideoBitrate: VIDEO_BITRATE,
    durationSeconds: Number(totalDurationSeconds.toFixed(2)),
    scenes: scenes.map((scene) => ({
      ...scene,
      still: path.relative(outputDir, buildStillPath(outputDir, scene)).replaceAll(path.sep, '/'),
      clip: path.relative(outputDir, buildClipPath(outputDir, scene)).replaceAll(path.sep, '/')
    }))
  };

  await fsp.writeFile(path.join(outputDir, path.basename(MANIFEST_PATH)), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));
  const scenes = resolveScenes(options);
  if (options.help) {
    printHelp();
    return;
  }

  await ensureFfmpegInstalled();
  ensureElectronInstalled();
  await ensureCleanOutput(options.outputDir);

  let serverInfo = null;
  const captureOptions = { ...options };

  try {
    if (!captureOptions.baseUrl) {
      serverInfo = await startStaticServer();
      captureOptions.baseUrl = serverInfo.baseUrl;
    }

    await spawnElectronCapture(captureOptions);
    await renderTrailer(captureOptions.outputDir, scenes);
    await writeManifest(captureOptions.outputDir, scenes);
    console.log(`Trailer written to ${path.join(captureOptions.outputDir, path.basename(FINAL_VIDEO_PATH))}`);
  } finally {
    if (serverInfo) {
      await stopStaticServer(serverInfo.server);
    }
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

(async () => {
  try {
    if (isElectronMainProcess()) {
      await runElectronCapture();
      return;
    }

    await runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  }
})();
