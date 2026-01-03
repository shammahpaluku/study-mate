# Study Mate - Desktop Application

A comprehensive study companion application built with Electron, React, TypeScript, and Chakra UI.

## 📦 For End Users (Ready-to-Use Application)

### Download and Install

**Windows Users:**

**Option 1: Portable Version (Recommended)**
1. Download `StudyMate-Portable.zip` from [Releases page](https://github.com/shammahpaluku/study-mate/releases)
2. Extract the ZIP file to any folder
3. Double-click `StudyMate.bat` to launch the application
4. No installation required - completely portable!

**Option 2: Installer Version**
1. Download the `.exe` installer from [Releases page](https://github.com/shammahpaluku/study-mate/releases)
2. Run the installer
3. Follow the installation wizard
4. Launch "Study Mate" from your desktop or Start Menu

**macOS Users:**
1. Download `.dmg` file from [Releases](https://github.com/shammahpaluku/study-mate/releases)
2. Open the downloaded file
3. Drag Study Mate to your Applications folder
4. Launch from Applications

**Linux Users:**
1. Download appropriate package from [Releases](https://github.com/shammahpaluku/study-mate/releases)
2. Install using your package manager:
   - Ubuntu/Debian: `sudo dpkg -i studymate.deb`
   - Fedora/RHEL: `sudo rpm -i studymate.rpm`
   - Or use the AppImage: `chmod +x StudyMate.AppImage && ./StudyMate.AppImage`

### ✨ What's Included

The packaged application comes with:
- **All dependencies pre-installed** - No need to run `npm install`
- **Ready-to-run desktop application** - Just extract and run
- **No Node.js required** (for installer versions)
- **Automatic updates** (when enabled)
- **Professional desktop experience** - No terminal windows

### 🚀 Quick Start (Portable Version)

1. Download `StudyMate-Portable.zip`
2. Extract anywhere on your computer
3. Double-click `StudyMate.bat`
4. Start planning your studies!

---

## 🛠️ For Developers

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shammahpaluku/study-mate.git
   cd study-mate/study-mate-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
 
3. **Development Mode:**
   ```bash
   npm run dev
   ```
   This runs the app in development mode with hot reload and DevTools.

4. **Build for Production:**
   
   **Simple Portable Build (Recommended for testing):**
   ```bash
   npm run build:simple
   ```
   Creates `StudyMate-Portable.zip` in the `release/` folder.
   
   **Full Installer Build:**
   ```bash
   npm run dist
   ```
   Creates installers for all platforms in the `release/` folder.

### Development Scripts

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run build` - Build the application
- `npm run start` - Build and run locally
- `npm run build:simple` - Create portable package
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS package
- `npm run dist:linux` - Build Linux packages

## Troubleshooting

### Application closes immediately
- Make sure you're running `npm run start` not `npm run dev`
- The `start` command builds the app first and runs it in production mode
- The `dev` command is for development and may show a terminal window

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is compatible (recommended: 18.x or higher)

## License

MIT
