# Study Mate - Desktop Application

A comprehensive study companion application built with Electron, React, TypeScript, and Chakra UI.

## Quick Start

### For Users (Running the built application)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shammahpaluku/study-mate.git
   cd study-mate/study-mate-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build and run the application:**
   ```bash
   npm run start
   ```
   
   This will build the application and launch it as a proper desktop app (no terminal window).

### For Developers

#### Development Mode
```bash
npm run dev
```
This runs the app in development mode with hot reload and DevTools.

#### Build Only
```bash
npm run build
```
Builds the application without running it.

#### Run After Build
```bash
npm run electron
```
Runs the already-built application.

## Application Features

- **Study Planning**: Create and manage study units with time allocation
- **Progress Tracking**: Monitor your study progress and achievements
- **Analytics**: Visualize your study patterns and performance
- **Responsive Design**: Works seamlessly on different screen sizes
- **Modern UI**: Built with Chakra UI for a beautiful, accessible interface

## Distribution

Create distributable packages for different platforms:

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux

# All platforms
npm run dist
```

The distributable files will be created in the `dist/` folder.

## Development

### Project Structure
```
study-mate-app/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React frontend
│   └── components/     # Shared components
├── dist/               # Built application
└── webpack configs     # Build configuration
```

### Scripts
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run dev` - Development mode with hot reload
- `npm run start` - Build and run production version
- `npm run dist` - Create distributable packages

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
