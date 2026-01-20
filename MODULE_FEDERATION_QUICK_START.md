# Module Federation Quick Start
## Load Angular Latest App in Angular 11 - Quick Steps

⚠️ **CRITICAL CONSTRAINT**: Your Angular 11 app requires **Node.js 12** and cannot use Node.js 13+.

**Solution**: Use **separate Node.js versions**:
- **Angular 11 app**: Node.js 12 (your current setup)
- **Angular Latest app**: Node.js 18+ (separate environment)

**How**: Use **NVM** to switch between versions, or build Angular Latest separately.

⚠️ **Important**: `@angular-architects/module-federation` typically requires Angular 12+. If you encounter issues with Angular 11:
- **Option 1**: Use **pre-built bundle approach** (recommended for Node 12 constraint)
- **Option 2**: Upgrade Angular 11 → 12 first (⚠️ may require Node.js 14+)
- **Option 3**: Use custom webpack configuration
- **Option 4**: Use iframe approach as fallback

See [MODULE_FEDERATION_SETUP_GUIDE.md](./MODULE_FEDERATION_SETUP_GUIDE.md) for detailed alternatives.

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Remote App (Angular Latest)

**⚠️ IMPORTANT: Switch to Node.js 18+ first!**

```bash
# Switch to Node 18+ (using NVM)
nvm use 18

# 1. Create new Angular app
npx @angular/cli@latest new angular-latest-remote --routing
cd angular-latest-remote

# 2. Install Module Federation
npm install @angular-architects/module-federation --save-dev
ng add @angular-architects/module-federation --project angular-latest-remote --port 4201 --type remote

# 3. Create Hello World component
ng generate component hello-world
```

**hello-world.component.ts**:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `
    <div style="padding: 20px; text-align: center;">
      <h1>Hello World from Angular Latest!</h1>
      <p>Loaded as remote module in Angular 11</p>
    </div>
  `
})
export class HelloWorldComponent {}
```

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

**Verify webpack.config.js** has:
```javascript
exposes: {
  './HelloWorldModule': './src/app/hello-world/hello-world.module.ts'
}
```

---

### Step 2: Configure Host App (Angular 11)

**⚠️ IMPORTANT: Use Node.js 12 for Angular 11 app!**

```bash
# Switch to Node 12 (using NVM)
nvm use 12

# In your Angular 11 project
npm install @angular-architects/module-federation --save-dev
ng add @angular-architects/module-federation --project your-app-name --port 4200 --type host
```

**Note**: If Module Federation setup fails with Angular 11 + Node 12, use the **pre-built bundle approach** (see Step 4 Alternative).

**Update webpack.config.js** (Host):
```javascript
remotes: {
  "angularLatestRemote": "angularLatestRemote@http://localhost:4201/remoteEntry.js"
}
```

**Update app-routing.module.ts**:
```typescript
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
  }
];
```

---

### Step 3: Run Both Apps

**Terminal 1** (Remote - **Node.js 18+**):
```bash
nvm use 18
cd angular-latest-remote
npm run serve
# http://localhost:4201
```

**Terminal 2** (Host - **Node.js 12**):
```bash
nvm use 12
cd angular-11-app
npm run serve
# http://localhost:4200
```

**Test**: Navigate to `http://localhost:4200/new-feature`

**Alternative**: If you can't run Node 18+ locally, build Angular Latest once and serve pre-built files:
```bash
# Build once (on machine with Node 18+)
cd angular-latest-remote
npm run build

# Serve pre-built files (works with Node 12)
cd dist/angular-latest-remote
npx http-server -p 4201 --cors
```

---

### Step 4: Apache Deployment

**Build Remote App** (with **Node.js 18+**):
```bash
nvm use 18
cd angular-latest-remote
npm run build
```

**Build Host App** (with **Node.js 12**):
```bash
nvm use 12
cd angular-11-app
npm run build -- --base-href=/app/
```

**Alternative: Pre-built Bundle Approach** (If Module Federation doesn't work with Angular 11 + Node 12):

1. Build Angular Latest once (with Node 18+ on separate machine/CI)
2. Deploy built files to Apache `/remote/` directory
3. Use `RemoteLoaderService` in Angular 11 to load bundles manually
4. See [MODULE_FEDERATION_SETUP_GUIDE.md](./MODULE_FEDERATION_SETUP_GUIDE.md) for implementation

**Apache Structure**:
```
/var/www/html/
├── app/              # Angular 11 host
│   └── index.html
└── remote/           # Angular Latest remote
    └── remoteEntry.js
```

**Apache Config**:
```apache
# Host app
Alias /app /var/www/html/app
<Directory /var/www/html/app>
    RewriteEngine On
    RewriteBase /app/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /app/index.html [L]
</Directory>

# Remote app
Alias /remote /var/www/html/remote
```

**Update webpack.config.js** (Host - Production):
```javascript
remotes: {
  "angularLatestRemote": "angularLatestRemote@/remote/remoteEntry.js"
}
```

---

## ✅ Checklist

- [ ] Remote app created and builds
- [ ] Module Federation configured in remote
- [ ] Hello World component created and exposed
- [ ] Host app configured with Module Federation
- [ ] Route added to load remote module
- [ ] Both apps run in development
- [ ] Route `/new-feature` loads remote module
- [ ] Production builds work
- [ ] Apache deployment configured
- [ ] Tested in production environment

---

## 🐛 Common Issues

**CORS Error**: Add CORS headers in Apache for `/remote/`

**Module Not Found**: Check remoteEntry.js URL is correct

**Version Conflicts**: Set `strictVersion: false` in shared dependencies

---

**For detailed guide**: See [MODULE_FEDERATION_SETUP_GUIDE.md](./MODULE_FEDERATION_SETUP_GUIDE.md)

