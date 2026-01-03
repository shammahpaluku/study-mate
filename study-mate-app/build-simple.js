#!/usr/bin/env node

/**
 * Simple Production Build Script
 * 
 * This creates a portable package without code signing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Study Mate production package...\n');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('release')) {
  fs.rmSync('release', { recursive: true, force: true });
}
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Create release directory
fs.mkdirSync('release', { recursive: true });

// Copy built files to release directory
console.log('📦 Creating portable package...');
const releaseDir = path.join('release', 'StudyMate-Portable');
fs.mkdirSync(releaseDir, { recursive: true });

// Copy dist folder
const distPath = path.join(process.cwd(), 'dist');
const releaseDistPath = path.join(releaseDir, 'dist');
copyFolder(distPath, releaseDistPath);

// Copy package.json
fs.copyFileSync('package.json', path.join(releaseDir, 'package.json'));

// Create a simple launcher script
const launcherScript = `@echo off
cd /d "%~dp0"
node dist/main.js
`;

fs.writeFileSync(path.join(releaseDir, 'StudyMate.bat'), launcherScript);

// Create README for portable version
const portableReadme = `# Study Mate - Portable Version

## How to Run

1. Double-click \`StudyMate.bat\` to launch the application
2. Or run \`node dist/main.js\` from the command line

## Requirements

- Node.js 18.x or higher must be installed on your system
- Download from: https://nodejs.org/

## Features

- Study planning and scheduling
- Progress tracking
- Analytics and insights
- Modern desktop interface

For the full installer version, visit: https://github.com/shammahpaluku/study-mate/releases
`;

fs.writeFileSync(path.join(releaseDir, 'README.md'), portableReadme);

// Create ZIP archive
console.log('🗜️ Creating ZIP archive...');
const archiver = require('archiver');
const output = fs.createWriteStream('release/StudyMate-Portable.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ ZIP archive created: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n🎉 Production package created successfully!');
  console.log('\n📁 Created files:');
  console.log('  📄 StudyMate-Portable/ - Portable application folder');
  console.log('  📄 StudyMate-Portable.zip - Compressed archive');
  console.log('\n📋 Distribution options:');
  console.log('  1. Upload StudyMate-Portable.zip to GitHub Releases');
  console.log('  2. Users can extract and run StudyMate.bat');
  console.log('  3. Requires Node.js to be installed on user machines');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(releaseDir, 'StudyMate-Portable');
archive.finalize();

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
