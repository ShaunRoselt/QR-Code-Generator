'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
const cli = require.resolve('electron-builder/cli.js', { paths: [root] });

function runElectronBuilder(args, options = {}) {
  const cwd = options.cwd ?? root;
  const { cwd: _cwd, ...spawnOptions } = options;

  execFileSync(process.execPath, [cli, '--publish', 'never', ...args], {
    stdio: 'inherit',
    cwd,
    ...spawnOptions
  });
}

module.exports = { runElectronBuilder };