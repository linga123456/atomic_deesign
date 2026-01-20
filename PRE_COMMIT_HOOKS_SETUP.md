# Pre-Commit Hooks Setup Guide
## Mandatory Lint Fixes & Unit Tests Before Commit

This guide shows you how to enforce:
1. **Lint fixes** must pass before commit
2. **Unit tests** must pass for any changed TypeScript files before commit

---

## Overview

**Tools Used**:
- **Husky**: Git hooks made easy
- **lint-staged**: Run linters on staged files only
- **Angular CLI**: For linting and testing

**What Happens**:
1. Developer makes changes and stages files
2. Developer runs `git commit`
3. Pre-commit hook automatically:
   - Runs lint fixes on staged TypeScript files
   - Runs unit tests for changed TypeScript files
   - Blocks commit if lint or tests fail
   - Allows commit only if everything passes

---

## Step 1: Install Dependencies

In your Angular 11 project root:

```bash
# Install Husky (Git hooks manager)
npm install --save-dev husky

# Install lint-staged (run linters on staged files)
npm install --save-dev lint-staged

# Initialize Husky
npx husky install
```

**For existing projects**, add to `package.json`:
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

This ensures Husky is installed when someone runs `npm install`.

---

## Step 2: Configure lint-staged

Create `.lintstagedrc.json` in your project root:

```json
{
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
```

**Alternative**: Add to `package.json`:
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

---

## Step 3: Create Pre-Commit Hook

Create `.husky/pre-commit` file:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged (lint fixes)
npx lint-staged

# Run unit tests for changed TypeScript files
npx lint-staged --config .lintstagedrc.test.json
```

**Make it executable** (Mac/Linux):
```bash
chmod +x .husky/pre-commit
```

**Windows**: The file should already be executable.

---

## Step 4: Configure Test Runner for Changed Files

Create `.lintstagedrc.test.json`:

```json
{
  "*.ts": [
    "bash -c 'npm run test -- --include=\"**/$FILE\" --watch=false --browsers=ChromeHeadless --code-coverage=false'"
  ]
}
```

**Better approach**: Create a custom script to run tests for changed files.

Create `scripts/test-changed-files.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const { readFileSync } = require('fs');

// Get list of staged TypeScript files
const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
  .split('\n')
  .filter(file => file.endsWith('.ts') && !file.endsWith('.spec.ts'));

if (stagedFiles.length === 0) {
  console.log('No TypeScript files changed, skipping tests');
  process.exit(0);
}

// Find corresponding spec files
const specFiles = stagedFiles
  .map(file => {
    // Try to find spec file
    const specFile = file.replace(/\.ts$/, '.spec.ts');
    try {
      readFileSync(specFile);
      return specFile;
    } catch {
      // No spec file found
      console.error(`❌ No unit test found for: ${file}`);
      console.error(`   Expected spec file: ${specFile}`);
      return null;
    }
  })
  .filter(Boolean);

if (specFiles.length === 0) {
  console.error('❌ No unit tests found for changed files!');
  console.error('   Please add unit tests before committing.');
  process.exit(1);
}

// Run tests
console.log('Running unit tests for changed files...');
try {
  execSync(`npm run test -- --include="${specFiles.join(',')}" --watch=false --browsers=ChromeHeadless`, {
    stdio: 'inherit'
  });
  console.log('✅ All tests passed!');
} catch (error) {
  console.error('❌ Tests failed! Please fix tests before committing.');
  process.exit(1);
}
```

**Update `.lintstagedrc.test.json`**:
```json
{
  "*.ts": [
    "node scripts/test-changed-files.js"
  ]
}
```

---

## Step 5: Simplified Approach (Recommended)

For Angular 11, use a simpler approach that runs all tests (faster for small projects):

**Update `.husky/pre-commit`**:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running lint fixes on staged files..."
npx lint-staged

echo "🧪 Running unit tests..."
npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage=false

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Please fix tests before committing."
  exit 1
fi

echo "✅ All checks passed! Proceeding with commit..."
```

**For larger projects**, use the changed-files approach (Step 4).

---

## Step 6: Configure ESLint (If Not Already Configured)

Ensure you have ESLint configured. Create or update `.eslintrc.json`:

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {}
    }
  ]
}
```

---

## Step 7: Configure Prettier (Optional but Recommended)

Create `.prettierrc.json`:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

Create `.prettierignore`:
```
node_modules
dist
coverage
*.md
```

---

## Step 8: Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage=false",
    "test:changed": "node scripts/test-changed-files.js"
  }
}
```

---

## Step 9: Test the Setup

### Test 1: Lint Fixes

1. Create a file with lint errors:
```typescript
// src/app/test.component.ts
export class TestComponent{
  test="hello"
}
```

2. Stage the file:
```bash
git add src/app/test.component.ts
```

3. Try to commit:
```bash
git commit -m "Test commit"
```

**Expected**: Lint fixes should run automatically and fix the errors, then commit.

### Test 2: Unit Tests

1. Modify a TypeScript file without a spec file:
```typescript
// src/app/test.component.ts
export class TestComponent {
  test = 'hello';
}
```

2. Stage and commit:
```bash
git add src/app/test.component.ts
git commit -m "Test commit"
```

**Expected**: Should fail with "No unit test found" error.

3. Create a spec file:
```typescript
// src/app/test.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { TestComponent } from './test.component';

describe('TestComponent', () => {
  it('should create', () => {
    const component = new TestComponent();
    expect(component).toBeTruthy();
  });
});
```

4. Try commit again:
```bash
git add src/app/test.component.spec.ts
git commit -m "Test commit"
```

**Expected**: Tests should run and commit should succeed.

---

## Step 10: Advanced Configuration

### Option A: Only Test Changed Files (Faster)

Use the `test-changed-files.js` script from Step 4.

### Option B: Require Minimum Test Coverage

Update `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

npm run test:ci -- --code-coverage

# Check coverage threshold
COVERAGE=$(cat coverage/coverage-summary.json | grep -o '"lines":{"pct":[0-9]*' | grep -o '[0-9]*$')
THRESHOLD=80

if [ "$COVERAGE" -lt "$THRESHOLD" ]; then
  echo "❌ Code coverage ($COVERAGE%) is below threshold ($THRESHOLD%)"
  exit 1
fi
```

### Option C: Skip Hooks (Emergency Only)

If you absolutely need to skip hooks (not recommended):

```bash
git commit --no-verify -m "Emergency commit"
```

**⚠️ Warning**: Only use in emergencies. Document why you skipped hooks.

---

## Complete File Structure

```
your-angular-11-project/
├── .husky/
│   └── pre-commit          # Pre-commit hook
├── scripts/
│   └── test-changed-files.js  # Test runner for changed files
├── .lintstagedrc.json      # lint-staged config
├── .lintstagedrc.test.json # Test config for lint-staged
├── .eslintrc.json          # ESLint config
├── .prettierrc.json        # Prettier config
├── .prettierignore         # Prettier ignore
└── package.json            # Updated with scripts
```

---

## Troubleshooting

### Issue: Husky not running

**Solution**:
```bash
# Reinstall Husky
rm -rf .husky
npm install --save-dev husky
npx husky install
```

### Issue: lint-staged not found

**Solution**:
```bash
npm install --save-dev lint-staged
```

### Issue: Tests taking too long

**Solution**: Use the changed-files approach (Step 4) instead of running all tests.

### Issue: ESLint errors not auto-fixing

**Solution**: Check `.eslintrc.json` configuration. Some rules require manual fixes.

### Issue: Pre-commit hook fails but changes are correct

**Solution**: 
1. Check lint errors: `npm run lint`
2. Fix manually if auto-fix doesn't work
3. Run tests: `npm run test:ci`
4. Fix test failures
5. Try commit again

---

## Team Onboarding

### For New Team Members

1. Clone the repository
2. Run `npm install` (Husky will be installed automatically via `prepare` script)
3. Husky hooks are now active

### For Existing Team Members

1. Pull latest changes
2. Run `npm install` to install Husky
3. Run `npx husky install` if hooks don't work

---

## Best Practices

1. **Always run tests locally** before committing (faster feedback)
2. **Fix lint errors immediately** (don't let them accumulate)
3. **Write tests alongside code** (TDD approach)
4. **Don't skip hooks** unless absolutely necessary
5. **Document why** if you skip hooks

---

## Quick Reference

```bash
# Install dependencies
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install

# Create pre-commit hook
echo 'npx lint-staged && npm run test:ci' > .husky/pre-commit

# Test the setup
git add .
git commit -m "Test commit"
```

---

## Next Steps

1. **Install dependencies** (Step 1)
2. **Configure lint-staged** (Step 2)
3. **Create pre-commit hook** (Step 3)
4. **Test the setup** (Step 9)
5. **Share with team** (Team Onboarding section)

---

**For more information**:
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Angular Testing Guide](https://angular.io/guide/testing)

