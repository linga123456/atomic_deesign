# Pre-Commit Hooks - Setup Instructions
## Step-by-Step Installation for Your Angular 11 Project

---

## 📋 Prerequisites

- Angular 11 project
- Node.js 12 (your current constraint)
- Git repository initialized
- npm or yarn package manager

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

Navigate to your Angular 11 project root and run:

```bash
npm install --save-dev husky lint-staged
```

Or with yarn:
```bash
yarn add --dev husky lint-staged
```

### Step 2: Initialize Husky

```bash
npx husky install
```

### Step 3: Add prepare Script

Add this to your `package.json` scripts section:

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

This ensures Husky is installed automatically when team members run `npm install`.

### Step 4: Add Test Script

Add this to your `package.json` scripts section:

```json
{
  "scripts": {
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage=false"
  }
}
```

### Step 5: Add lint-staged Configuration

Add this to your `package.json`:

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{html,scss,css,json}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

**Alternative**: Create `.lintstagedrc.json` file (copy from this repository).

### Step 6: Copy Files from This Repository

Copy these files to your Angular 11 project:

1. **`.husky/pre-commit`** → `.husky/pre-commit`
   - Pre-commit hook script

2. **`scripts/test-changed-files.js`** → `scripts/test-changed-files.js`
   - Script to check for unit tests and run them

3. **`.prettierrc.json`** → `.prettierrc.json` (optional)
   - Prettier configuration

4. **`.prettierignore`** → `.prettierignore` (optional)
   - Files to ignore for Prettier

### Step 7: Make Script Executable (Mac/Linux)

```bash
chmod +x .husky/pre-commit
chmod +x scripts/test-changed-files.js
```

**Windows**: Files should already be executable.

### Step 8: Install Prettier (If Not Already Installed)

```bash
npm install --save-dev prettier
```

### Step 9: Install ESLint (If Not Already Installed)

Angular 11 projects typically use TSLint. You may need to migrate to ESLint or use TSLint:

**Option A: Use TSLint (if still using it)**
```json
{
  "lint-staged": {
    "*.ts": [
      "npm run lint -- --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

**Option B: Migrate to ESLint**
```bash
ng add @angular-eslint/schematics
```

### Step 10: Test the Setup

1. **Create a test file with lint errors**:
```typescript
// src/app/test.component.ts
export class TestComponent{
  test="hello"
}
```

2. **Stage the file**:
```bash
git add src/app/test.component.ts
```

3. **Try to commit**:
```bash
git commit -m "Test commit"
```

**Expected**: Lint should auto-fix errors, then commit should proceed or fail if no test file exists.

4. **Create a spec file**:
```typescript
// src/app/test.component.spec.ts
import { TestComponent } from './test.component';

describe('TestComponent', () => {
  it('should create', () => {
    const component = new TestComponent();
    expect(component).toBeTruthy();
  });
});
```

5. **Try commit again**:
```bash
git add src/app/test.component.spec.ts
git commit -m "Test commit"
```

**Expected**: Tests should run and commit should succeed.

---

## ✅ Verification Checklist

- [ ] `husky` installed in `devDependencies`
- [ ] `lint-staged` installed in `devDependencies`
- [ ] `.husky/pre-commit` file exists and is executable
- [ ] `scripts/test-changed-files.js` exists and is executable
- [ ] `package.json` has `prepare` script
- [ ] `package.json` has `test:ci` script
- [ ] `package.json` has `lint-staged` configuration
- [ ] Pre-commit hook runs on `git commit`
- [ ] Lint fixes run automatically
- [ ] Tests are required for TypeScript files
- [ ] Commit is blocked if tests fail

---

## 🔧 Customization

### Skip Tests for Specific Files

Edit `scripts/test-changed-files.js` to exclude certain files:

```javascript
// Exclude files matching patterns
const excludedPatterns = [
  /\.config\.ts$/,
  /\.module\.ts$/,
  /\.routing\.ts$/
];

stagedFiles = stagedFiles.filter(file => 
  !excludedPatterns.some(pattern => pattern.test(file))
);
```

### Run Only Changed File Tests (Faster)

The current setup runs all tests. For faster execution, you can modify `test-changed-files.js` to run only tests for changed files (requires custom test runner setup).

### Adjust Lint Rules

Edit your ESLint or TSLint configuration to adjust rules.

---

## 🐛 Troubleshooting

### Issue: "husky: command not found"

**Solution**:
```bash
npm install --save-dev husky
npx husky install
```

### Issue: "lint-staged: command not found"

**Solution**:
```bash
npm install --save-dev lint-staged
```

### Issue: Pre-commit hook not running

**Solution**:
```bash
# Reinstall Husky
rm -rf .husky
npx husky install

# Verify hook exists
ls -la .husky/pre-commit
```

### Issue: Tests taking too long

**Solution**: 
- Use the changed-files approach (modify `test-changed-files.js`)
- Or run tests in watch mode during development, only run full suite on commit

### Issue: ESLint not found

**Solution**: 
- If using TSLint, update `lint-staged` config to use `npm run lint`
- Or migrate to ESLint: `ng add @angular-eslint/schematics`

### Issue: Prettier not found

**Solution**:
```bash
npm install --save-dev prettier
```

---

## 📝 Team Onboarding

### For New Team Members

1. Clone the repository
2. Run `npm install` (Husky will be installed automatically)
3. Pre-commit hooks are now active

### For Existing Team Members

1. Pull latest changes
2. Run `npm install`
3. Run `npx husky install` if hooks don't work

---

## 🎯 What Happens on Commit

1. **Lint Stage**:
   - ESLint/TSLint runs on staged `.ts` files
   - Auto-fixes lint errors
   - Prettier formats code
   - Changes are staged again

2. **Test Stage**:
   - Script checks for `.spec.ts` files for changed `.ts` files
   - Fails if any `.ts` file doesn't have a corresponding `.spec.ts` file
   - Runs unit tests
   - Fails if any test fails

3. **Commit**:
   - Only proceeds if all checks pass
   - Blocks commit if anything fails

---

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [ESLint Documentation](https://eslint.org/)

---

**Need help?** See [PRE_COMMIT_HOOKS_SETUP.md](./PRE_COMMIT_HOOKS_SETUP.md) for detailed guide.

