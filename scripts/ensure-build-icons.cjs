#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pngPath = path.join(root, 'assets', 'favicon.png');
const icoCandidates = [
  path.join(root, 'assets', 'favicon.ico'),
  path.join(root, 'assets', 'icons', 'app-icon.ico')
];

async function ensureBuildIcons() {
  if (!fs.existsSync(pngPath)) {
    throw new Error(`Missing app icon source: ${pngPath}`);
  }

  const icoPath = icoCandidates.find((candidate) => fs.existsSync(candidate)) || '';

  return { icoPath, pngPath };
}

module.exports = {
  ensureBuildIcons,
  pngPath
};

if (require.main === module) {
  ensureBuildIcons()
    .then(({ icoPath }) => {
      console.log(`PNG build icon -> ${path.relative(root, pngPath)}`);
      if (icoPath) {
        console.log(`ICO build icon -> ${path.relative(root, icoPath)}`);
      } else {
        console.log('ICO build icon -> not found; Windows metadata patch will skip icon replacement');
      }
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}