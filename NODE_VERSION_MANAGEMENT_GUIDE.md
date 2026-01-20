# Node.js Version Management Guide
## Managing Multiple Node.js Versions for Angular 11 + Angular Latest

---

## Problem

- **Angular 11 app**: Requires Node.js 12 (cannot use Node.js 13+)
- **Angular Latest app**: Requires Node.js 18+
- **Need**: Run both apps simultaneously or build separately

---

## Solution: Use Node Version Manager (NVM)

NVM allows you to install and switch between multiple Node.js versions easily.

---

## Installation

### Windows

**Download**: [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

1. Download `nvm-setup.exe`
2. Run installer
3. Restart terminal/PowerShell

**Verify**:
```powershell
nvm version
```

### Mac/Linux

**Install via script**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Or via Homebrew** (Mac):
```bash
brew install nvm
```

**Add to shell profile** (`~/.bashrc` or `~/.zshrc`):
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**Verify**:
```bash
nvm --version
```

---

## Usage

### Install Node.js Versions

```bash
# Install Node.js 12 (for Angular 11)
nvm install 12

# Install Node.js 18 (for Angular Latest)
nvm install 18

# Install Node.js 20 (latest LTS)
nvm install 20
```

### Switch Between Versions

```bash
# Use Node.js 12
nvm use 12

# Use Node.js 18
nvm use 18

# Verify current version
node --version
```

### List Installed Versions

```bash
nvm list
```

### Set Default Version

```bash
# Set Node.js 12 as default (for Angular 11)
nvm alias default 12
```

---

## Workflow for Your Project

### Development Setup

**Terminal 1** (Angular 11 App):
```bash
# Switch to Node 12
nvm use 12

# Navigate to Angular 11 project
cd angular-11-app

# Install dependencies (if needed)
npm install

# Run development server
npm run serve
```

**Terminal 2** (Angular Latest App):
```bash
# Switch to Node 18
nvm use 18

# Navigate to Angular Latest project
cd angular-latest-remote

# Install dependencies (if needed)
npm install

# Run development server
npm run serve
```

### Build Workflow

**Build Angular Latest** (once, with Node 18+):
```bash
nvm use 18
cd angular-latest-remote
npm run build
# Output: dist/angular-latest-remote/
```

**Build Angular 11** (with Node 12):
```bash
nvm use 12
cd angular-11-app
npm run build
# Output: dist/angular-11-app/
```

---

## Alternative: Use .nvmrc Files

Create `.nvmrc` files in each project to automatically use the correct Node version.

### Angular 11 Project

**Create `.nvmrc`**:
```
12
```

**Use**:
```bash
cd angular-11-app
nvm use
# Automatically switches to Node 12
```

### Angular Latest Project

**Create `.nvmrc`**:
```
18
```

**Use**:
```bash
cd angular-latest-remote
nvm use
# Automatically switches to Node 18
```

---

## CI/CD Setup

### GitHub Actions Example

```yaml
name: Build Angular Latest

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js 18
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
      working-directory: ./angular-latest-remote
    
    - name: Build
      run: npm run build
      working-directory: ./angular-latest-remote
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: angular-latest-build
        path: angular-latest-remote/dist/
```

---

## Troubleshooting

### Issue: `nvm` command not found

**Windows**: Restart terminal after installation

**Mac/Linux**: Add to shell profile:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Issue: Wrong Node version in terminal

**Solution**: Check current version and switch:
```bash
node --version
nvm use 12  # or 18
```

### Issue: npm packages not found after switching

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Best Practices

1. **Use `.nvmrc` files** in each project for automatic version switching
2. **Document Node version** in `README.md` for each project
3. **Set default to Node 12** (for Angular 11) if that's your primary project
4. **Use CI/CD** to build Angular Latest with Node 18+ automatically
5. **Build Angular Latest separately** and deploy pre-built bundles

---

## Quick Reference

```bash
# Install versions
nvm install 12
nvm install 18

# Switch versions
nvm use 12
nvm use 18

# List installed
nvm list

# Set default
nvm alias default 12

# Use .nvmrc
nvm use
```

---

**For more information**: 
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [nvm (Mac/Linux)](https://github.com/nvm-sh/nvm)

