import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { User } from '../entities/User';
import { Unit } from '../entities/Unit';
import { StudyPlan } from '../entities/StudyPlan';
import { StudySession } from '../entities/StudySession';
import { ProgressLog } from '../entities/ProgressLog';

type Entity = User | Unit | StudyPlan | StudySession | ProgressLog;
type EntityType = new () => Entity;
type EntityName = 'user' | 'unit' | 'studyPlan' | 'studySession' | 'progressLog';

const entityMap: Record<EntityName, EntityType> = {
  user: User,
  unit: Unit,
  studyPlan: StudyPlan,
  studySession: StudySession,
  progressLog: ProgressLog,
};

let mainWindow: BrowserWindow | null = null;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'study_mate',
  synchronize: true,
  logging: true,
  entities: [User, Unit, StudyPlan, StudySession, ProgressLog],
  subscribers: [],
  migrations: [],
});

// Type-safe repository method access
const ALLOWED_METHODS = ['find', 'findOne', 'save', 'update', 'delete'] as const;
type RepositoryMethod = typeof ALLOWED_METHODS[number];

function isRepositoryMethod(method: string): method is RepositoryMethod {
  return (ALLOWED_METHODS as readonly string[]).includes(method);
}

function createWindow() {
  // Initialize the database connection
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connection established');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the index.html file
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // Open the DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('database:query', async (event, { 
  entity, 
  method, 
  params = [] 
}: { 
  entity: EntityName; 
  method: string; 
  params: any[];
}) => {
  const entityClass = entityMap[entity];
  if (!entityClass) {
    throw new Error(`Invalid entity: ${entity}`);
  }
  
  if (!isRepositoryMethod(method)) {
    throw new Error(`Method ${method} is not allowed`);
  }

  const repository = AppDataSource.getRepository(entityClass);
  try {
    const repoMethod = repository[method];
    if (typeof repoMethod === 'function') {
      return await (repoMethod as (...args: any[]) => any)(...params);
    }
    throw new Error(`Method ${method} is not a function on repository`);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
});
