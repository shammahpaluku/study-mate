# Study Mate 📚

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/shammahpaluku/study-mate?style=social)](https://github.com/shammahpaluku/study-mate/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/shammahpaluku/study-mate)](https://github.com/shammahpaluku/study-mate/issues)

A modern desktop application for managing study materials, notes, and learning progress. Built with Electron, React, TypeScript, and Chakra UI.

## ✨ Features

- **Cross-platform** - Works on Windows, macOS, and Linux
- **Modern UI** - Built with React and Chakra UI
- **Offline Support** - Works without an internet connection
- **Data Persistence** - Built with TypeORM and PostgreSQL
- **Responsive Design** - Adapts to different screen sizes

## Prerequisites

- Node.js 16.x or later
- PostgreSQL 12 or later
- npm or yarn

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/study-mate.git
   cd study-mate
   ```

2. Install dependencies:
   ```bash
   cd study-mate-app
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database named `study_mate`
   - Update the database configuration in `.env` file

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production build:
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Project Structure

```
study-mate/
├── study-mate-app/         # Electron + React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── entities/       # TypeORM entities
│   │   ├── hooks/          # Custom React hooks
│   │   ├── theme/          # Theme configuration
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)

---

Built with ❤️ by [Shammah Paluku](https://github.com/shammahpaluku)
