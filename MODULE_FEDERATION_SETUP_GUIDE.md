# Module Federation Setup Guide
## Loading Angular Latest App as Module in Angular 11

This guide shows you how to create a simple "Hello World" Angular latest app and load it as a module in your Angular 11 application when a route is invoked.

---

## Overview

**Goal**: Create Angular latest app → Build as Module Federation remote → Load in Angular 11 app via route

**Architecture**:
```
Angular 11 App (Host/Shell)
  └── Route: /new-feature
      └── Loads Angular Latest App (Remote)
```

---

## Prerequisites

- **Node.js 12** (for Angular 11 app - your current constraint)
- **Node.js 18+** (for Angular latest app - separate environment)
- Angular CLI latest (for new app only)
- Angular 11 app running (with Node 12)
- Understanding of Module Federation basics

⚠️ **Critical Constraint**: Your Angular 11 app requires Node.js 12 and cannot use Node.js 13+.

**Solution**: Use **separate Node.js versions** for each app:
- **Angular 11 app**: Use Node.js 12 (current setup)
- **Angular Latest app**: Use Node.js 18+ (separate environment)

**How to manage**: Use **NVM (Node Version Manager)** or build Angular Latest app separately, then deploy pre-built bundles.

⚠️ **Important Note**: `@angular-architects/module-federation` typically requires Angular 12+. If you encounter issues with Angular 11, you may need to:
1. Upgrade Angular 11 to Angular 12 first (incremental upgrade) - **BUT this may require Node.js 14+**
2. Or use a custom webpack configuration
3. Or use an alternative approach (see Alternative Approaches section)
4. Or use **pre-built bundles** approach (recommended for Node 12 constraint)

---

## Step 1: Create Angular Latest App (Remote)

### ⚠️ Node.js Version Management

Since your Angular 11 app requires Node.js 12, you need to use **Node.js 18+** for the Angular Latest app.

**Option A: Use NVM (Recommended)**
```bash
# Install NVM (if not already installed)
# Windows: https://github.com/coreybutler/nvm-windows
# Mac/Linux: https://github.com/nvm-sh/nvm

# Switch to Node 18+ for Angular Latest app
nvm install 18
nvm use 18

# Create Angular Latest app
npx @angular/cli@latest new angular-latest-remote --routing --style=scss
cd angular-latest-remote

# When done, switch back to Node 12 for Angular 11 app
nvm use 12
```

**Option B: Use Separate Terminal/Environment**
- Keep Angular 11 app in Node 12 environment
- Use different machine/VM/container with Node 18+ for Angular Latest app
- Build Angular Latest app separately, then copy built files

**Option C: Build Once, Deploy Pre-built Bundle**
- Build Angular Latest app once with Node 18+
- Deploy the built bundle (`remoteEntry.js` and chunks) to Apache
- Angular 11 app only loads the pre-built bundle (no Node 18+ needed at runtime)

### 1.1 Create New Angular Project

**⚠️ IMPORTANT: Switch to Node.js 18+ first!**

```bash
# Switch to Node 18+ (using NVM)
nvm use 18

# Create new Angular project (latest version)
npx @angular/cli@latest new angular-latest-remote --routing --style=scss

# Navigate to project
cd angular-latest-remote
```

### 1.2 Install Module Federation Plugin

```bash
# Install @angular-architects/module-federation
npm install @angular-architects/module-federation --save-dev

# Initialize Module Federation
ng add @angular-architects/module-federation --project angular-latest-remote --port 4201 --type remote
```

This will:
- Create `webpack.config.js` with Module Federation setup
- Configure the app to run on port 4201
- Set up as a remote module

### 1.3 Create Simple Hello World Component

```bash
# Generate component
ng generate component hello-world --project angular-latest-remote
```

**hello-world.component.ts**:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `
    <div class="hello-world">
      <h1>Hello World from Angular Latest!</h1>
      <p>This is loaded as a remote module in Angular 11</p>
      <p>Angular Version: {{ angularVersion }}</p>
    </div>
  `,
  styles: [`
    .hello-world {
      padding: 20px;
      text-align: center;
      background: #f0f0f0;
      border-radius: 8px;
    }
    h1 {
      color: #1976d2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelloWorldComponent {
  angularVersion = 'Angular Latest';
}
```

### 1.4 Configure Module Federation (webpack.config.js)

The `ng add` command should create this, but verify it looks like:

```javascript
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = {
  output: {
    uniqueName: "angular-latest-remote",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angularLatestRemote",
      filename: "remoteEntry.js",
      exposes: {
        './HelloWorldModule': './src/app/hello-world/hello-world.module.ts'
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' }
      }
    })
  ]
};
```

### 1.5 Create Module to Expose

**hello-world.module.ts**:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [CommonModule],
  exports: [HelloWorldComponent]
})
export class HelloWorldModule { }
```

### 1.6 Update App Routing (Optional - for standalone route)

**app-routing.module.ts**:
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';

const routes: Routes = [
  { path: '', component: HelloWorldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 1.7 Build Remote App

```bash
# Build for production
npm run build

# Or serve for development
npm run serve
```

The remote will be available at: `http://localhost:4201/remoteEntry.js`

---

## Step 2: Configure Angular 11 App (Host/Shell)

### 2.1 Install Module Federation in Angular 11

```bash
# In your Angular 11 project directory
cd /path/to/angular-11-app

# Install Module Federation plugin
npm install @angular-architects/module-federation --save-dev

# Initialize as host
ng add @angular-architects/module-federation --project your-app-name --port 4200 --type host
```

### 2.2 Configure webpack.config.js (Host)

**webpack.config.js** (in Angular 11 app):
```javascript
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = {
  output: {
    uniqueName: "angular-11-host",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        "angularLatestRemote": "angularLatestRemote@http://localhost:4201/remoteEntry.js"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' }
      }
    })
  ]
};
```

### 2.3 Create Route to Load Remote Module

**app-routing.module.ts** (Angular 11):
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'new-feature',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'angularLatestRemote',
        exposedModule: './HelloWorldModule'
      }).then(m => m.HelloWorldModule)
  },
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 2.4 Create Container Component (Optional)

If you want a wrapper component in Angular 11:

**new-feature-container.component.ts**:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-new-feature-container',
  template: `
    <div class="container">
      <h2>Angular 11 Host App</h2>
      <app-hello-world></app-hello-world>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFeatureContainerComponent {}
```

**app-routing.module.ts** (Alternative with container):
```typescript
const routes: Routes = [
  {
    path: 'new-feature',
    component: NewFeatureContainerComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule({
            remoteEntry: 'http://localhost:4201/remoteEntry.js',
            remoteName: 'angularLatestRemote',
            exposedModule: './HelloWorldModule'
          }).then(m => m.HelloWorldModule)
      }
    ]
  }
];
```

---

## Step 3: Development Setup

### 3.1 Start Both Apps (With Node Version Management)

**Terminal 1** (Remote - Angular Latest) - **Node.js 18+**:
```bash
# Switch to Node 18+
nvm use 18

cd angular-latest-remote
npm run serve
# Runs on http://localhost:4201
```

**Terminal 2** (Host - Angular 11) - **Node.js 12**:
```bash
# Switch to Node 12
nvm use 12

cd angular-11-app
npm run serve
# Runs on http://localhost:4200
```

**Alternative: Use Pre-built Remote (If Node 18+ Not Available)**

If you can't run Node 18+ locally:

1. **Build Angular Latest app once** (on different machine/CI with Node 18+):
```bash
# On machine with Node 18+
cd angular-latest-remote
npm run build
# Output: dist/angular-latest-remote/
```

2. **Serve pre-built files** (using simple HTTP server with Node 12):
```bash
# Install simple HTTP server (works with Node 12)
npm install -g http-server

# Serve pre-built remote
cd dist/angular-latest-remote
http-server -p 4201 --cors
```

3. **Update Angular 11 app** to point to pre-built remote:
```javascript
// webpack.config.js (Host)
remotes: {
  "angularLatestRemote": "angularLatestRemote@http://localhost:4201/remoteEntry.js"
}
```

### 3.2 Test the Integration

1. Open browser: `http://localhost:4200`
2. Navigate to: `http://localhost:4200/new-feature`
3. Should see "Hello World from Angular Latest!" component

---

## Step 4: Production Build & Apache Deployment

### 4.1 Build Remote App (Angular Latest)

**⚠️ IMPORTANT: Use Node.js 18+ for building Angular Latest app!**

```bash
# Switch to Node 18+
nvm use 18

cd angular-latest-remote
npm run build
```

**Output**: `dist/angular-latest-remote/`

**Key files**:
- `remoteEntry.js` - Module Federation entry point
- `main.js` - Main bundle
- Other chunks

**Note**: Once built, these are static files. You can copy them to Apache without needing Node.js 18+ on the server.

### 4.1.1 Alternative: Build on CI/CD or Separate Machine

If you don't have Node 18+ locally:

1. **Build on CI/CD** (GitHub Actions, Jenkins, etc. with Node 18+)
2. **Build on separate machine** with Node 18+
3. **Copy built files** to Apache server

**Build script** (for CI/CD):
```bash
#!/bin/bash
# build-remote.sh
nvm use 18
cd angular-latest-remote
npm install
npm run build
# Output: dist/angular-latest-remote/
```

### 4.2 Build Host App (Angular 11)

**⚠️ Use Node.js 12 for Angular 11 app!**

```bash
# Switch to Node 12
nvm use 12

cd angular-11-app
npm run build -- --base-href=/your-app-path/
```

**Output**: `dist/your-app-name/`

**Note**: If Module Federation setup requires Node.js 14+ for Angular 11, you may need to use the **pre-built bundle approach** (see Alternative Approaches).

### 4.3 Apache Configuration

**Option A: Same Domain (Recommended)**

Deploy both apps under same domain:

```
/var/www/html/
├── angular-11-host/          # Angular 11 app
│   ├── index.html
│   ├── main.js
│   └── ...
└── angular-latest-remote/     # Angular Latest remote
    ├── remoteEntry.js
    ├── main.js
    └── ...
```

**Apache Virtual Host** (`/etc/apache2/sites-available/your-app.conf`):
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html

    # Angular 11 Host App
    Alias /app /var/www/html/angular-11-host
    <Directory /var/www/html/angular-11-host>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle Angular routing
        RewriteEngine On
        RewriteBase /app/
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /app/index.html [L]
    </Directory>

    # Angular Latest Remote
    Alias /remote /var/www/html/angular-latest-remote
    <Directory /var/www/html/angular-latest-remote>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Update webpack.config.js** (Host) for production:
```javascript
remotes: {
  "angularLatestRemote": "angularLatestRemote@/remote/remoteEntry.js"
}
```

**Option B: Different Domains**

If remote is on different domain:

```javascript
// Development
remotes: {
  "angularLatestRemote": "angularLatestRemote@http://localhost:4201/remoteEntry.js"
}

// Production
remotes: {
  "angularLatestRemote": "angularLatestRemote@https://remote-domain.com/remoteEntry.js"
}
```

Use environment files to switch:

**environment.ts**:
```typescript
export const environment = {
  production: false,
  remoteUrl: 'http://localhost:4201/remoteEntry.js'
};
```

**environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  remoteUrl: '/remote/remoteEntry.js'  // or full URL
};
```

**app-routing.module.ts**:
```typescript
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: 'new-feature',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: environment.remoteUrl,
        remoteName: 'angularLatestRemote',
        exposedModule: './HelloWorldModule'
      }).then(m => m.HelloWorldModule)
  }
];
```

---

## Step 5: Troubleshooting

### Issue 1: CORS Errors

**Solution**: Configure CORS in Apache for remote:

```apache
# In remote app's .htaccess or Apache config
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
```

### Issue 2: Module Not Found

**Solution**: Check:
- Remote entry URL is correct
- Remote is built and deployed
- Module name matches in webpack config

### Issue 3: Version Conflicts

**Solution**: Use shared dependencies in webpack:

```javascript
shared: {
  "@angular/core": { singleton: true, strictVersion: false },  // Allow different versions
  "@angular/common": { singleton: true, strictVersion: false }
}
```

### Issue 4: Routing Issues

**Solution**: Ensure base href is set correctly:

```html
<!-- index.html -->
<base href="/app/">
```

---

## Step 6: Complete File Structure

```
angular-latest-remote/          # Remote App
├── src/
│   ├── app/
│   │   ├── hello-world/
│   │   │   ├── hello-world.component.ts
│   │   │   └── hello-world.module.ts
│   │   └── app.module.ts
│   └── main.ts
├── webpack.config.js
├── package.json
└── angular.json

angular-11-app/                 # Host App
├── src/
│   ├── app/
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   └── main.ts
├── webpack.config.js
├── package.json
└── angular.json
```

---

## Quick Start Commands

### Remote App (Angular Latest)
```bash
# Create project
npx @angular/cli@latest new angular-latest-remote --routing
cd angular-latest-remote

# Setup Module Federation
npm install @angular-architects/module-federation --save-dev
ng add @angular-architects/module-federation --project angular-latest-remote --port 4201 --type remote

# Create component
ng generate component hello-world

# Serve
npm run serve
```

### Host App (Angular 11)
```bash
# In Angular 11 project
npm install @angular-architects/module-federation --save-dev
ng add @angular-architects/module-federation --project your-app --port 4200 --type host

# Update routing (see Step 2.3)

# Serve
npm run serve
```

---

## Testing Checklist

- [ ] Remote app builds successfully
- [ ] Remote app serves on port 4201
- [ ] Host app builds successfully
- [ ] Host app serves on port 4200
- [ ] Navigate to `/new-feature` loads remote module
- [ ] No console errors
- [ ] Styles load correctly
- [ ] Production build works
- [ ] Apache deployment works
- [ ] Routes work correctly

---

## Next Steps

1. **Test locally** - Get it working in development first
2. **Build for production** - Test production builds
3. **Deploy to Apache** - Test in Apache environment
4. **Add more features** - Gradually migrate components
5. **Optimize** - Bundle size, lazy loading, etc.

---

## Important Notes

⚠️ **Version Compatibility**:
- Module Federation with Angular requires careful version management
- Shared dependencies must be compatible
- Consider using `strictVersion: false` for different Angular versions

⚠️ **Apache Configuration**:
- Ensure proper CORS headers
- Configure routing correctly
- Set correct base href

⚠️ **Development vs Production**:
- Use environment files for different remote URLs
- Test production builds before deploying

---

## Alternative Approaches (If Angular 11 Has Issues)

### Option 1: Pre-built Bundle Approach (Recommended for Node 12 Constraint)

**Best solution if Module Federation doesn't work with Angular 11 + Node 12:**

1. **Build Angular Latest app** with Node 18+ (once, on separate machine/CI)
2. **Deploy pre-built bundle** to Apache
3. **Load bundle directly** in Angular 11 app (no Module Federation needed)

**Implementation**:

**Step 1**: Build Angular Latest app (with Node 18+):
```bash
# On machine with Node 18+
cd angular-latest-remote
npm run build
# Output: dist/angular-latest-remote/
```

**Step 2**: Create standalone bundle loader:
```typescript
// In Angular 11 app: src/app/services/remote-loader.service.ts
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RemoteLoaderService {
  private loadedModules: Map<string, any> = new Map();

  async loadRemoteModule(remoteUrl: string, moduleName: string): Promise<any> {
    const cacheKey = `${remoteUrl}:${moduleName}`;
    
    if (this.loadedModules.has(cacheKey)) {
      return this.loadedModules.get(cacheKey);
    }

    // Load remote entry script
    await this.loadScript(remoteUrl);
    
    // Get module from window (Module Federation exposes it)
    const container = (window as any)[moduleName];
    if (!container) {
      throw new Error(`Module ${moduleName} not found`);
    }

    // Initialize container
    await container.init(__webpack_share_scopes__.default);
    
    // Get exposed module
    const factory = await container.get('./HelloWorldModule');
    const module = factory();
    
    this.loadedModules.set(cacheKey, module);
    return module;
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
  }
}
```

**Step 3**: Use in routing:
```typescript
// app-routing.module.ts
import { RemoteLoaderService } from './services/remote-loader.service';

const routes: Routes = [
  {
    path: 'new-feature',
    loadChildren: () => {
      const loader = inject(RemoteLoaderService);
      return loader.loadRemoteModule(
        '/remote/remoteEntry.js',
        'angularLatestRemote'
      ).then(m => m.HelloWorldModule);
    }
  }
];
```

**Pros**: 
- Works with Node 12 constraint
- No Module Federation setup needed in Angular 11
- Simple deployment

**Cons**: 
- Manual bundle loading
- Less automatic than Module Federation

### Option 2: Upgrade Angular 11 to 12 First

If Module Federation doesn't work with Angular 11:

```bash
# ⚠️ WARNING: Angular 12 may require Node.js 14+
# Check compatibility first!

# Upgrade Angular 11 → 12 first
ng update @angular/core@12 @angular/cli@12
```

**Note**: Angular 12 typically requires Node.js 14+. If your app truly cannot work with Node.js > 12, this option may not be viable.

### Option 3: Custom Webpack Configuration

If `@angular-architects/module-federation` doesn't support Angular 11, use custom webpack:

```bash
npm install @angular-builders/custom-webpack --save-dev
```

Update `angular.json`:
```json
{
  "architect": {
    "build": {
      "builder": "@angular-builders/custom-webpack:browser",
      "options": {
        "customWebpackConfig": {
          "path": "./webpack.config.js"
        }
      }
    }
  }
}
```

### Option 4: Iframe Approach (Fallback)

If Module Federation doesn't work, use iframe as temporary solution:

**In Angular 11 app**:
```html
<!-- app.component.html -->
<iframe 
  *ngIf="showNewFeature"
  src="http://localhost:4201"
  style="width: 100%; height: 100vh; border: none;">
</iframe>
```

**Pros**: Simple, works immediately  
**Cons**: Not true integration, communication limitations

---

## Troubleshooting Node.js 12 Constraint

### Issue: Angular 11 app requires Node.js 12, but Angular Latest needs Node.js 18+

**Solution 1: Use NVM (Node Version Manager)** - Recommended
```bash
# Install NVM
# Windows: https://github.com/coreybutler/nvm-windows
# Mac/Linux: https://github.com/nvm-sh/nvm

# For Angular 11 app
nvm use 12
cd angular-11-app
npm install
npm run serve

# For Angular Latest app (separate terminal)
nvm use 18
cd angular-latest-remote
npm install
npm run serve
```

**Solution 2: Build Angular Latest Separately**
- Build Angular Latest app on machine/CI with Node 18+
- Copy built files to Apache
- Angular 11 app only loads pre-built bundles (no Node 18+ needed)

**Solution 3: Use Pre-built Bundle Approach** (See Option 1 in Alternative Approaches)
- No Module Federation setup in Angular 11
- Load bundles manually
- Works with Node 12 constraint

### Issue: `@angular-architects/module-federation` not compatible with Angular 11

**Solution 1**: Use pre-built bundle approach (see Option 1 in Alternative Approaches)

**Solution 2**: Use custom webpack (see Option 3 above)

**Solution 3**: Check if there's a fork/branch for Angular 11 support

**Solution 4**: Upgrade to Angular 12 (⚠️ may require Node.js 14+)
```bash
ng update @angular/core@12 @angular/cli@12
```

---

**For detailed Module Federation documentation**: See [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation)

