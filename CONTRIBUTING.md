# Contributing to TypedApi Explorer

First off, thank you for considering contributing to TypedApi Explorer! This project is part of the #PAPI30Days educational initiative, and we welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Style Guide](#style-guide)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title**: Descriptive and specific
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: OS, Node version, browser, etc.

Example:
```markdown
## Bug: Connection fails on Windows

**Steps to reproduce:**
1. Run `npm run dev`
2. Click "Initialize TypedApi"
3. Wait 30 seconds

**Expected:** Connection succeeds
**Actual:** Timeout error after 30s

**Environment:**
- OS: Windows 11
- Node: v20.10.0
- Browser: Chrome 120
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title**: What feature you want
- **Use case**: Why this would be useful
- **Proposed solution**: How you envision it working
- **Alternatives**: Other solutions you considered

Example:
```markdown
## Enhancement: Add Kusama Support

**Use case:** Many developers work with Kusama testnet first

**Proposed solution:**
1. Add Kusama descriptors generation
2. Create chain selector in UI
3. Allow switching between networks

**Alternatives:**
- Separate app for each chain (more complex)
- CLI argument for chain selection (less user-friendly)
```

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples
- Improve README
- Create tutorials
- Add code comments

### 💻 Code Contributions

We welcome code contributions! Here are areas where you can help:

#### Easy Contributions (Good First Issues)
- Add more chain constants to explore
- Improve error messages
- Add loading indicators
- Enhance mobile responsiveness
- Add more code comments

#### Intermediate Contributions
- Add query examples (balances, accounts)
- Implement multi-chain support
- Add transaction builders
- Create data visualizations
- Improve TypeScript types

#### Advanced Contributions
- Implement advanced RxJS patterns
- Add WebWorker support
- Create custom hooks
- Build testing infrastructure
- Performance optimizations

## Development Setup

### Prerequisites
```bash
node --version  # Should be >= 20.0.0
npm --version   # Should be >= 10.0.0
```

### Fork and Clone

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork example
git clone https://github.com/YOUR_USERNAME/papi-day4-typedAPI-explorer.git
cd papi-day4-typedAPI-explorer

# 3. Add upstream remote example
git remote add upstream https://github.com/ORIGINAL_OWNER/papi-day4-typedAPI-explorer.git
```

### Install Dependencies

```bash
# Install packages
npm install

# Generate TypedApi descriptors
npm run setup

# Start dev server
npm run dev
```

### Keep Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

## Contribution Guidelines

### Branch Naming

Use descriptive branch names:

```bash
# Feature branches
git checkout -b feature/add-kusama-support
git checkout -b feature/multi-chain-selector

# Bug fix branches
git checkout -b fix/connection-timeout
git checkout -b fix/mobile-layout

# Documentation branches
git checkout -b docs/improve-readme
git checkout -b docs/add-examples
```

### Code Style

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Format is automatically checked in PR
```

#### TypeScript Guidelines

```typescript
// ✅ Good: Descriptive names, types, comments
/**
 * Fetches a chain constant with full type safety
 * @param constant The constant configuration
 * @returns Promise with typed constant value
 */
async function fetchConstantValue(constant: ChainConstant): Promise<void> {
  // Implementation
}

// ❌ Bad: No types, unclear names
async function fetch(c) {
  // Implementation
}
```

#### CSS Guidelines

```css
/* ✅ Good: Use CSS variables, organized */
.constant-card {
  background: var(--bg-card);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
}

/* ❌ Bad: Hard-coded values, no organization */
.constant-card {
  background: rgba(255, 255, 255, 0.04);
  padding: 16px;
  border-radius: 12px;
}
```

### Testing Your Changes

Before submitting a PR:

```bash
# 1. Build succeeds
npm run build

# 2. No TypeScript errors
npx tsc --noEmit

# 3. Format is correct
npm run format

# 4. App runs correctly
npm run dev
# Manually test your changes
```

### Documentation

Update documentation for your changes:

- **README.md**: If adding features
- **SETUP_GUIDE.md**: If changing setup process
- **Code comments**: For complex logic
- **TypeDoc**: For public APIs

## Style Guide

### JavaScript/TypeScript

```typescript
// Use const/let, not var
const client = createClient(provider);
let selectedConstant: ChainConstant | null = null;

// Use async/await, not callbacks
async function connect() {
  const result = await dotApi.constants.System.Version();
}

// Destructure when appropriate
const { specName, specVersion } = await dotApi.constants.System.Version();

// Use optional chaining
const status = document.getElementById('status')?.textContent;

// Use template literals
console.log(`Connected to ${specName} v${specVersion}`);
```

### CSS

```css
/* Use BEM-like naming */
.constant-card {}
.constant-card__header {}
.constant-card--selected {}

/* Mobile-first responsive design */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-8);
  }
}

/* Use CSS variables */
background: var(--bg-card);
color: var(--text-primary);
```

## Commit Messages

We follow conventional commits:

```bash
# Format
<type>(<scope>): <subject>

# Types
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance

# Examples
feat(constants): add Kusama support
fix(connection): handle timeout errors
docs(readme): improve setup instructions
style(css): improve mobile responsiveness
refactor(main): extract connection logic
chore(deps): update polkadot-api to v1.24
```

### Examples

```bash
# ✅ Good commits
git commit -m "feat(ui): add loading spinner during connection"
git commit -m "fix(types): resolve TypeScript errors in main.ts"
git commit -m "docs(contributing): add code style guidelines"

# ❌ Bad commits
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## Pull Request Process

### 1. Create Your Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code, code, code ...

# Commit with good messages
git add .
git commit -m "feat(scope): your changes"
```

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Open Pull Request

Go to GitHub and click "New Pull Request"

#### PR Template

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally

## Screenshots (if applicable)
Add screenshots showing your changes

## Related Issues
Closes #123
```

### 4. Code Review

- Respond to feedback promptly
- Make requested changes
- Push updates to same branch
- Don't force push without discussion

### 5. Merge

Once approved:
- Maintainer will merge your PR
- Your changes will be in the main branch
- Delete your feature branch

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## Questions?

- Open a GitHub issue
- Tag with `question` label
- Ask in discussions

## Thank You! 🙏

Every contribution, no matter how small, helps make this project better for everyone learning about TypedApi and Polkadot development.

---

**Happy Contributing!** 🚀

Remember: The best contribution is the one that helps others learn!