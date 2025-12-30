# Contributing to Study Mate

Thank you for your interest in contributing to Study Mate! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/study-mate.git
   cd study-mate/study-mate-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development:
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes
```bash
npm run lint
npm run build
npm start
```

### 4. Submit a Pull Request
- Push your branch to your fork
- Create a pull request with a clear description
- Wait for review and feedback

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused

## Bug Reports

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please:
- Check existing issues first
- Provide a clear description
- Explain the use case
- Suggest implementation ideas if possible

## Questions

If you have questions, feel free to:
- Open an issue with the "question" label
- Start a discussion in the repository

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
