const DB_NAME = 'kanban-db';
const DB_VERSION = 2; // Incremented for schema change
const STORE_NAME = 'tasks';
const PROJECTS_STORE = 'projects';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject('Could not open database');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = async (event) => {
      const db = event.target.result;
      const transaction = event.currentTarget.transaction;

      // Tasks store
      let taskStore;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        taskStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      } else {
        taskStore = transaction.objectStore(STORE_NAME);
      }

      // Add projectId index if not exists
      if (!taskStore.indexNames.contains('projectId')) {
        taskStore.createIndex('projectId', 'projectId', { unique: false });
      }

      // Projects store
      if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
        const projectStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });

        // MIGRATION: Create default project and assign existing tasks
        // We can't use await here easily inside onupgradeneeded without being careful.
        // But we can add the default project.
        const defaultProject = { id: 'default', name: 'Main Project', createdAt: new Date().toISOString() };
        projectStore.put(defaultProject);

        // We will migrate existing tasks in a separate function or later in onsuccess if needed,
        // but since we have the transaction here, let's try to update existing tasks if possible.
        // However, iterating cursor inside upgradeneeded is safe.
        taskStore.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const task = cursor.value;
            if (!task.projectId) {
              task.projectId = 'default';
              cursor.update(task);
            }
            cursor.continue();
          }
        };
      }
    };
  });
};

// --- Projects ---

export const getProjects = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROJECTS_STORE], 'readonly');
    const store = transaction.objectStore(PROJECTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error fetching projects');
  });
};

export const addProject = async (project) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
    const store = transaction.objectStore(PROJECTS_STORE);
    const request = store.put(project);

    request.onsuccess = () => resolve(project);
    request.onerror = () => reject('Error adding project');
  });
};

export const updateProject = async (project) => {
  return addProject(project);
};

export const deleteProject = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROJECTS_STORE, STORE_NAME], 'readwrite');
    const projectStore = transaction.objectStore(PROJECTS_STORE);
    const taskStore = transaction.objectStore(STORE_NAME);

    // Delete project
    projectStore.delete(id);

    // Delete all tasks associated with this project
    const index = taskStore.index('projectId');
    const request = index.getAllKeys(IDBKeyRange.only(id));

    request.onsuccess = () => {
      const keys = request.result;
      keys.forEach(key => taskStore.delete(key));
    };

    transaction.oncomplete = () => resolve(id);
    transaction.onerror = () => reject('Error deleting project');
  });
};

// --- Tasks ---

export const getTasks = async (projectId = 'default') => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('projectId');
    const request = index.getAll(IDBKeyRange.only(projectId));

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject('Error fetching tasks');
    };
  });
};

export const addTask = async (task) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(task);

    request.onsuccess = () => {
      resolve(task);
    };
    request.onerror = () => {
      reject('Error adding task');
    };
  });
};

export const updateTask = async (task) => {
  return addTask(task);
};

export const deleteTask = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(id);
    };
    request.onerror = () => {
      reject('Error deleting task');
    };
  });
};

export const clearAllTasks = async (projectId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // If projectId provided, only clear those
    if (projectId) {
      const index = store.index('projectId');
      const request = index.openCursor(IDBKeyRange.only(projectId));

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      transaction.oncomplete = () => resolve();
    } else {
      // Clear everything (legacy behavior or full wipe)
      const request = store.clear();
      request.onsuccess = () => resolve();
    }

    transaction.onerror = () => reject('Error clearing tasks');
  });
};

export const bulkAddTasks = async (tasks) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject('Error bulk adding tasks');
    };

    tasks.forEach(task => {
      store.put(task);
    });
  });
};
