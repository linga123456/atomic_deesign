# Pre-Commit Hooks - Quick Start
## 5-Minute Setup for Mandatory Lint & Tests

---

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install --save-dev husky lint-staged
npx husky install
```

### Step 2: Add to package.json

```json
{
  "scripts": {
    "prepare": "husky install",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage=false"
  },
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

### Step 3: Create Pre-Commit Hook

```bash
# Create .husky directory if it doesn't exist
mkdir -p .husky

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running lint fixes..."
npx lint-staged

echo "🧪 Running unit tests..."
npm run test:ci

if [ $? -ne 0 ]; then
  echo "❌ Checks failed! Fix errors before committing."
  exit 1
fi

echo "✅ All checks passed!"
EOF

# Make executable (Mac/Linux)
chmod +x .husky/pre-commit
```

### Step 4: Copy Test Script

Copy `scripts/test-changed-files.js` from this repository to your project.

### Step 5: Test It

```bash
# Make a change to a .ts file
echo "export const test = 'hello';" > src/app/test.ts

# Stage it
git add src/app/test.ts

# Try to commit (should fail - no test file)
git commit -m "Test"
```

---

## ✅ That's It!

Now every commit will:
1. ✅ Auto-fix lint errors
2. ✅ Format code with Prettier
3. ✅ Run unit tests
4. ✅ Block commit if anything fails

---

## 📋 Files to Copy

From this repository, copy to your Angular 11 project:

1. `.husky/pre-commit` → `.husky/pre-commit`
2. `.lintstagedrc.json` → `.lintstagedrc.json`
3. `scripts/test-changed-files.js` → `scripts/test-changed-files.js`
4. `.prettierrc.json` → `.prettierrc.json` (optional)
5. `.prettierignore` → `.prettierignore` (optional)

---

## 🔧 Customization

### Run Tests Only for Changed Files

Update `.husky/pre-commit`:
```bash
node scripts/test-changed-files.js
```

### Skip Hooks (Emergency Only)

```bash
git commit --no-verify -m "Emergency commit"
```

---

## 🐛 Troubleshooting

**Husky not working?**
```bash
npx husky install
```

**Tests too slow?**
Use `test-changed-files.js` to run only changed file tests.

**ESLint not found?**
```bash
npm install --save-dev @angular-eslint/eslint-plugin @angular-eslint/template-parser
```

---

**For detailed guide**: See [PRE_COMMIT_HOOKS_SETUP.md](./PRE_COMMIT_HOOKS_SETUP.md)

