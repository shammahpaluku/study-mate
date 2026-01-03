#!/usr/bin/env node

/**
 * Production Build Script
 * 
 * This script creates production-ready distributables for Study Mate.
 * It bundles all dependencies so users don't need to install anything.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Study Mate for production...\n');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('release')) {
  fs.rmSync('release', { recursive: true, force: true });
}
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Run linting
console.log('🔍 Running linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️  Linting failed, but continuing with build...');
}

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Create distributables
console.log('📦 Creating distributables...');
try {
  execSync('npm run dist', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to create distributables');
  process.exit(1);
}

// List created files
console.log('\n✅ Build completed successfully!');
console.log('\n📁 Created files:');
if (fs.existsSync('release')) {
  const files = fs.readdirSync('release');
  files.forEach(file => {
    const filePath = path.join('release', file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`  📄 ${file} (${size} MB)`);
  });
}

console.log('\n🎉 Study Mate is ready for distribution!');
console.log('\n📋 Next steps:');
console.log('  1. Upload the files from the release/ folder to GitHub Releases');
console.log('  2. Users can now download and install without needing Node.js');
console.log('  3. The app includes all dependencies and is ready to run');
