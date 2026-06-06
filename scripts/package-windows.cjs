#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { copyToFinal } = require('./final-dist.cjs');
const { patch } = require('./patch-windows-exe.cjs');
const { runElectronBuilder } = require('./run-electron-builder.cjs');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const portableDir = path.join(distDir, 'Windows Portable');
const unpackedDir = path.join(distDir, 'Windows Unpacked');
const tmpDir = path.join(distDir, '.tmp-win-build');
const exeName = 'QR Code Generator.exe';
const winIconPath = path.join(root, 'assets', 'icons', 'app-icon-dark.ico');

const BUILDER_CRUFT = new Set([
  'builder-debug.yml',
  'builder-effective-config.yaml',
  'latest.yml',
  'latest-linux.yml'
]);

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function builder(args) {
  runElectronBuilder(args, { cwd: root });
}

function cleanBuilderCruft(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const isCruft = BUILDER_CRUFT.has(entry.name) || (entry.isFile() && entry.name.endsWith('.zip'));
    if (isCruft) {
      rmrf(path.join(dir, entry.name));
    }
  }
}

async function main() {
  console.log('> [1/3] Building Windows unpacked (electron-builder)...');
  rmrf(tmpDir);
  rmrf(unpackedDir);
  builder([
    '--win', 'dir',
    `--config.directories.output=${tmpDir}`,
    `--config.win.icon=${winIconPath}`
  ]);

  const stagedUnpacked = path.join(tmpDir, 'win-unpacked');
  if (!fs.existsSync(stagedUnpacked)) {
    throw new Error(`Expected unpacked output at "${stagedUnpacked}" but it was not produced.`);
  }

  console.log('> [2/3] Embedding native metadata + icon into the exe (resedit)...');
  await patch(path.join(stagedUnpacked, exeName));

  fs.renameSync(stagedUnpacked, unpackedDir);
  rmrf(tmpDir);
  cleanBuilderCruft(unpackedDir);

  console.log('> [3/3] Wrapping the patched build into the portable exe...');
  rmrf(portableDir);
  fs.mkdirSync(portableDir, { recursive: true });
  builder([
    '--win', 'portable',
    '--prepackaged', unpackedDir,
    `--config.directories.output=${portableDir}`,
    `--config.win.icon=${winIconPath}`
  ]);
  rmrf(path.join(portableDir, 'win-unpacked'));
  cleanBuilderCruft(portableDir);

  const portableExe = fs.readdirSync(portableDir)
    .find((name) => name.toLowerCase().endsWith('.exe'));
  if (portableExe) {
    copyToFinal(path.join(portableDir, portableExe), 'QR Code Generator.exe');
  }

  console.log('\nDone.');
  console.log(`  Windows Portable -> ${path.relative(root, portableDir)}`);
  console.log(`  Windows Unpacked -> ${path.relative(root, unpackedDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});