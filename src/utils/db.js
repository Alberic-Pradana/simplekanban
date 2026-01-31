const DB_NAME = 'kanban-db';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

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

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getTasks = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

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
    const request = store.put(task); // put can add or update if key exists, but usually add is 'add'. 'put' is safer for upsert.

    request.onsuccess = () => {
      resolve(task);
    };
    request.onerror = () => {
      reject('Error adding task');
    };
  });
};

export const updateTask = async (task) => {
  return addTask(task); // In IndexedDB, put overwrites if key exists
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

export const clearAllTasks = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
  
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject('Error clearing tasks');
      };
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
