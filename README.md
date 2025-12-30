# Study Mate 📚

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/study-mate?style=social)](https://github.com/yourusername/study-mate/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/study-mate)](https://github.com/yourusername/study-mate/issues)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/study-mate/releases)

A comprehensive desktop study companion application that helps students manage their learning journey with intelligent scheduling, progress tracking, and motivational features.

## ✨ Features

### 🎯 Study Planning
- **Unit Configuration** - Add and organize study units with difficulty levels and assessment dates
- **Availability Settings** - Set your study schedule and preferred study times
- **Smart Schedule Generation** - AI-powered study plan creation based on your availability

### 📊 Analytics & Progress
- **Study Analytics** - Track study time, sessions, and performance trends
- **Interactive Calendar** - Visualize your study patterns and progress
- **Streak Tracking** - Maintain motivation with achievement streaks
- **Goal Management** - Set and track learning goals with progress indicators

### 🎨 User Experience
- **Modern UI** - Beautiful, responsive interface built with React and Chakra UI
- **Dark Mode** - Toggle between light and dark themes
- **Motivational Quotes** - Stay inspired with rotating motivational content
- **Achievement System** - Unlock badges and milestones as you progress

### 💾 Data Management
- **Local Storage** - All data stored locally, no internet required
- **Export/Import** - Backup and restore your study data
- **Settings Persistence** - Custom preferences saved across sessions

## 🚀 Quick Start (Download & Run)

### Option 1: Download Executable (Recommended)
1. Go to the [Releases](https://github.com/yourusername/study-mate/releases) page
2. Download the appropriate version for your OS:
   - **Windows**: `StudyMate-Setup-1.0.0.exe` (Installer) or `StudyMate-Portable-1.0.0.exe` (Portable)
   - **macOS**: `StudyMate-1.0.0.dmg` or `StudyMate-1.0.0.zip`
   - **Linux**: `StudyMate-1.0.0.AppImage`, `StudyMate-1.0.0.deb`, or `StudyMate-1.0.0.rpm`
3. Run the downloaded file - no installation required for portable versions

### Option 2: Build from Source
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/study-mate.git
   cd study-mate/study-mate-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build and run:
   ```bash
   npm run build
   npm start
   ```

## 📦 Distribution Formats

### Windows
- **Installer** (`StudyMate-Setup-1.0.0.exe`) - Traditional installer with desktop shortcuts
- **Portable** (`StudyMate-Portable-1.0.0.exe`) - Single executable, no installation needed

### macOS
- **DMG** (`StudyMate-1.0.0.dmg`) - Drag-and-drop installer
- **ZIP** (`StudyMate-1.0.0.zip`) - Portable application bundle

### Linux
- **AppImage** (`StudyMate-1.0.0.AppImage`) - Universal portable format
- **DEB** (`StudyMate-1.0.0.deb`) - Debian/Ubuntu package
- **RPM** (`StudyMate-1.0.0.rpm`) - RedHat/Fedora package

## 🎯 How to Use

### 1. Configure Your Study Units
- Navigate to **Study Planner** in the sidebar
- Click **Add Unit** to create study modules
- Set difficulty, type, and assessment dates
- Units are automatically saved

### 2. Set Your Availability
- Configure daily study hours
- Select study days of the week
- Choose preferred study times
- Set study session preferences

### 3. Generate Study Schedule
- Click **Generate Plan** in the Study Planner
- Review the AI-generated schedule
- Adjust as needed

### 4. Track Progress
- Use **Dashboard** to monitor daily progress
- Check **Analytics** for detailed insights
- View **Calendar** for study patterns
- Monitor **Streaks** for motivation

### 5. Customize Experience
- Visit **Settings** to:
  - Enable/disable notifications
  - Toggle dark mode
  - Export/import data
  - Configure preferences

## 🛠️ Development

### Prerequisites
- Node.js 16.x or later
- npm or yarn

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run dist         # Build distributables for all platforms
npm run dist:win     # Build Windows executables
npm run dist:mac     # Build macOS executables
npm run dist:linux   # Build Linux executables
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure
```
study-mate/
├── study-mate-app/              # Electron + React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navigation.tsx
│   │   │   ├── UnitConfiguration.tsx
│   │   │   ├── StudyAnalytics.tsx
│   │   │   └── ...
│   │   ├── contexts/           # React contexts
│   │   │   └── SettingsContext.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── StudyPlannerPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── theme/              # Theme configuration
│   │   └── ...
│   ├── package.json
│   └── ...
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Version History

### Version 1.0.0 (Current)
- ✨ Initial release
- 🎯 Study planning and scheduling
- 📊 Analytics and progress tracking
- 🎨 Modern UI with dark mode
- 💾 Local data persistence
- 🏆 Achievement system
- 📱 Cross-platform support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Chakra UI](https://chakra-ui.com/) - UI component library
- [React Icons](https://react-icons.org/) - Icon library

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/study-mate/issues) on GitHub.

---

**Built with ❤️ for students everywhere** 📚✨
