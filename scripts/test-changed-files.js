#!/usr/bin/env node

/**
 * Test Runner for Changed Files
 * 
 * This script:
 * 1. Finds all staged TypeScript files (excluding .spec.ts files)
 * 2. Checks if corresponding .spec.ts files exist
 * 3. Runs unit tests for those spec files
 * 4. Fails if no tests found or tests fail
 */

const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get list of staged TypeScript files
let stagedFiles = [];
try {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  stagedFiles = output
    .split('\n')
    .filter(file => file.trim() !== '')
    .filter(file => file.endsWith('.ts') && !file.endsWith('.spec.ts'));
} catch (error) {
  log('❌ Error getting staged files', 'red');
  process.exit(1);
}

if (stagedFiles.length === 0) {
  log('ℹ️  No TypeScript files changed, skipping tests', 'blue');
  process.exit(0);
}

log(`\n📋 Found ${stagedFiles.length} changed TypeScript file(s):`, 'blue');
stagedFiles.forEach(file => log(`   - ${file}`, 'blue'));

// Find corresponding spec files and check if they exist
const missingTests = [];
const specFiles = [];

stagedFiles.forEach(file => {
  // Try to find spec file
  const specFile = file.replace(/\.ts$/, '.spec.ts');
  
  if (existsSync(specFile)) {
    specFiles.push(specFile);
    log(`✅ Test found: ${specFile}`, 'green');
  } else {
    missingTests.push({ source: file, expected: specFile });
    log(`❌ No test found: ${specFile}`, 'red');
  }
});

// Fail if any files are missing tests
if (missingTests.length > 0) {
  log('\n❌ Unit tests are required for all TypeScript files!', 'red');
  log('\nMissing test files:', 'yellow');
  missingTests.forEach(({ source, expected }) => {
    log(`   Source: ${source}`, 'yellow');
    log(`   Expected: ${expected}`, 'yellow');
  });
  log('\nPlease create unit tests before committing.', 'red');
  process.exit(1);
}

// Run tests
if (specFiles.length === 0) {
  log('ℹ️  No test files to run', 'blue');
  process.exit(0);
}

log(`\n🧪 Running ${specFiles.length} test file(s)...`, 'blue');

try {
  // Angular CLI doesn't support running specific test files directly
  // So we have two options:
  // 1. Run all tests (slower but reliable)
  // 2. Use a custom test runner (faster but more complex)
  
  // Option 1: Run all tests (recommended for small-medium projects)
  log('Running all unit tests...', 'blue');
  execSync('npm run test:ci', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  log('\n✅ All tests passed!', 'green');
  process.exit(0);
} catch (error) {
  log('\n❌ Tests failed! Please fix tests before committing.', 'red');
  log('\nTo run tests manually:', 'yellow');
  log('   npm run test:ci', 'yellow');
  process.exit(1);
}

