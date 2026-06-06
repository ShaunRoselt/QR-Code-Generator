#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { runElectronBuilder } = require('./run-electron-builder.cjs');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const tmpDir = path.join(distDir, '.tmp-linux-build');
const outputDir = path.join(distDir, 'QR Code Generator-linux-x64');
const linuxIconPath = path.join(root, 'assets', 'icons', 'app-icon-4096.png');

function rmrf(target) {
    fs.rmSync(target, { recursive: true, force: true });
}

async function main() {
    console.log('> Building Linux unpacked (electron-builder)...');
    rmrf(tmpDir);
    rmrf(outputDir);

    runElectronBuilder([
        '--linux', 'dir',
        '--x64',
        `--config.directories.output=${tmpDir}`,
        `--config.linux.icon=${linuxIconPath}`
    ], { cwd: root });

    const stagedUnpacked = path.join(tmpDir, 'linux-unpacked');
    if (!fs.existsSync(stagedUnpacked)) {
        throw new Error(`Expected unpacked output at "${stagedUnpacked}" but it was not produced.`);
    }

    fs.renameSync(stagedUnpacked, outputDir);
    rmrf(tmpDir);

    console.log('\nDone.');
    console.log(`  Linux Unpacked -> ${path.relative(root, outputDir)}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});