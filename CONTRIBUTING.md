
# Contributing to HealHive 🌿

Thank you for your interest in contributing to **HealHive** — a secure, real-time telehealth platform. We welcome all contributions, big or small!

---

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)
- [Pull Request Guidelines](#pull-request-guidelines)

---

## Code of Conduct

Please be respectful, inclusive, and constructive in all interactions. We follow a standard open-source code of conduct.

---

## How to Contribute

1. **Fork** the repository by clicking the "Fork" button on GitHub.
2. **Clone** your fork locally:
```bash
   git clone https://github.com/<your-username>/HealHive.git
   cd HealHive
```
3. **Add upstream** remote to stay in sync:
```bash
   git remote add upstream https://github.com/Ankita-Gupta2004/HealHive.git
```
4. **Create a branch** for your changes:
```bash
   git checkout -b feature/your-feature-name
```
5. **Make your changes**, commit, and push:
```bash
   git add .
   git commit -m "feat: describe your change"
   git push origin feature/your-feature-name
```
6. **Open a Pull Request** from your fork's branch to the `main` branch of the original repo.

---

## Development Setup

### Prerequisites
- Node.js (v16 or above)
- npm or yarn
- Firebase CLI (for deployment)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

> Make sure to configure your `.env` files based on `.env.example` if provided.

---

## Coding Standards

- Use **meaningful variable and function names**.
- Follow **ES6+ JavaScript** conventions.
- Keep components **small and focused** (single responsibility).
- Write **comments** for complex logic.
- Format code with **Prettier** before committing (if configured).
- Avoid committing `node_modules`, `.env`, or build folders.

---

## Reporting Issues

Before opening a new issue:
- 🔍 **Search existing issues** to avoid duplicates.
- Use a **clear and descriptive title**.
- Include **steps to reproduce**, expected vs actual behavior, and screenshots if applicable.
- Tag appropriately (bug, enhancement, documentation, etc.).

---

## Pull Request Guidelines

- Link your PR to the related issue using `Closes #issue-number`.
- Keep PRs **focused** — one feature or fix per PR.
- Ensure your branch is **up to date** with `main` before submitting.
- Add a clear **description** of what your PR does and why.
- Be responsive to **review comments**.

---

Thank you for helping make HealHive better for everyone! 💙
