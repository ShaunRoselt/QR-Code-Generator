#!/usr/bin/env node
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { copyToFinal } = require('./final-dist.cjs');
const { runElectronBuilder } = require('./run-electron-builder.cjs');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const outputDir = path.join(distDir, 'Linux AppImage');
const linuxIconPath = path.join(root, 'assets', 'icons', 'app-icon-4096.png');

function rmrf(target) {
    fs.rmSync(target, { recursive: true, force: true });
}

function which(command) {
    try {
        return execFileSync('sh', ['-lc', `command -v ${command}`]).toString().trim();
    } catch {
        return '';
    }
}

function makeUncompressed(appImagePath) {
    const mksquashfs = which('mksquashfs');
    const unsquashfs = which('unsquashfs');
    if (!mksquashfs || !unsquashfs) {
        console.warn('  (squashfs-tools not found; leaving default gzip compression)');
        return;
    }

    const offset = parseInt(execFileSync(appImagePath, ['--appimage-offset']).toString().trim(), 10);
    if (!Number.isFinite(offset) || offset <= 0) {
        console.warn('  (could not read AppImage offset; leaving default compression)');
        return;
    }

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appimage-repack-'));
    const runtimePath = path.join(workDir, 'runtime');
    const payloadPath = path.join(workDir, 'payload.sqfs');
    const extractDir = path.join(workDir, 'squashfs-root');
    const newSquashPath = path.join(workDir, 'uncompressed.sqfs');
    const newAppImagePath = `${appImagePath}.new`;

    try {
        execFileSync('dd', [`if=${appImagePath}`, `of=${runtimePath}`, 'bs=1M', `count=${offset}`, 'iflag=count_bytes', 'status=none']);
        execFileSync('dd', [`if=${appImagePath}`, `of=${payloadPath}`, 'bs=1M', `skip=${offset}`, 'iflag=skip_bytes', 'status=none']);
        execFileSync(unsquashfs, ['-d', extractDir, '-no-progress', payloadPath], { stdio: 'ignore' });
        execFileSync(mksquashfs, [
            extractDir,
            newSquashPath,
            '-noI',
            '-noD',
            '-noF',
            '-noX',
            '-no-fragments',
            '-all-root',
            '-noappend',
            '-b', '1M',
            '-no-progress',
            '-quiet'
        ], { stdio: 'ignore' });
        execFileSync('sh', ['-c', `cat "${runtimePath}" "${newSquashPath}" > "${newAppImagePath}"`]);
        fs.chmodSync(newAppImagePath, 0o755);
        fs.renameSync(newAppImagePath, appImagePath);
    } finally {
        rmrf(workDir);
        rmrf(newAppImagePath);
    }
}

async function main() {
    console.log('> Building Linux AppImage (electron-builder)...');
    rmrf(outputDir);
    fs.mkdirSync(outputDir, { recursive: true });

    runElectronBuilder([
        '--linux', 'AppImage',
        '--x64',
        `--config.directories.output=${outputDir}`,
        `--config.linux.icon=${linuxIconPath}`
    ], { cwd: root });

    let appImagePath = null;
    for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.appimage')) {
            appImagePath = path.join(outputDir, entry.name);
            continue;
        }

        rmrf(path.join(outputDir, entry.name));
    }

    if (appImagePath) {
        console.log('> Repacking payload uncompressed for fastest launch...');
        makeUncompressed(appImagePath);
        copyToFinal(appImagePath, 'QR Code Generator.AppImage');
    }

    console.log('\nDone.');
    console.log(`  Linux AppImage -> ${path.relative(root, outputDir)}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});