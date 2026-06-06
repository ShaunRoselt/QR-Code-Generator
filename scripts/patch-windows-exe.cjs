#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ResEdit = require('resedit');

const root = path.join(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const icoPath = path.join(root, 'assets', 'icons', 'app-icon-dark.ico');

const PRODUCT_NAME = pkg.build?.productName || 'QR Code Generator';
const COMPANY = (typeof pkg.author === 'string' ? pkg.author : pkg.author?.name) || 'Shaun Roselt';
const VERSION = String(pkg.version || '0.0.0');
const DESCRIPTION = pkg.description || PRODUCT_NAME;

function versionTuple(version) {
  const parts = version.split('.').map((part) => parseInt(part, 10) || 0);
  while (parts.length < 4) {
    parts.push(0);
  }
  return parts.slice(0, 4);
}

async function patch(exePath) {
  const exeName = path.basename(exePath);
  const data = fs.readFileSync(exePath);
  const exe = ResEdit.NtExecutable.from(data);
  const resources = ResEdit.NtExecutableResource.from(exe);

  const icon = ResEdit.Data.IconFile.from(fs.readFileSync(icoPath));
  const iconImages = icon.icons.map((entry) => entry.data);
  const groupIcons = resources.entries.filter((entry) => entry.type === 14);
  const groupIds = groupIcons.length > 0 ? [...new Set(groupIcons.map((entry) => entry.id))] : [1];

  for (const id of groupIds) {
    const lang = groupIcons.find((entry) => entry.id === id)?.lang ?? 1033;
    ResEdit.Resource.IconGroupEntry.replaceIconsForResource(resources.entries, id, lang, iconImages);
  }

  const [major, minor, patchNum, build] = versionTuple(VERSION);
  const versions = ResEdit.Resource.VersionInfo.fromEntries(resources.entries);
  const versionInfo = versions.length > 0 ? versions[0] : ResEdit.Resource.VersionInfo.createEmpty();

  versionInfo.setFileVersion(major, minor, patchNum, build);
  versionInfo.setProductVersion(major, minor, patchNum, build);

  const languages = versionInfo.getAllLanguagesForStringValues();
  const targetLanguages = languages.length > 0 ? languages : [{ lang: 1033, codepage: 1200 }];

  for (const language of targetLanguages) {
    versionInfo.setStringValues(language, {
      Comments: DESCRIPTION,
      CompanyName: COMPANY,
      FileDescription: PRODUCT_NAME,
      FileVersion: VERSION,
      InternalName: PRODUCT_NAME,
      LegalCopyright: `Copyright © ${new Date().getFullYear()} ${COMPANY}`,
      OriginalFilename: exeName,
      ProductName: PRODUCT_NAME,
      ProductVersion: VERSION
    });
  }

  versionInfo.outputToResourceEntries(resources.entries);
  resources.outputResource(exe);
  fs.writeFileSync(exePath, Buffer.from(exe.generate()));
}

module.exports = { patch };

if (require.main === module) {
  const target = process.argv[2];

  if (!target) {
    console.error('Usage: node scripts/patch-windows-exe.cjs "<path-to-exe>"');
    process.exit(1);
  }

  if (!fs.existsSync(target)) {
    console.error(`Executable not found: ${target}`);
    process.exit(1);
  }

  patch(target)
    .then(() => {
      console.log(`  patched native metadata + icon -> ${path.basename(target)}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}