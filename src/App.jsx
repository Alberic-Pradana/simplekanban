import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import KanbanColumn from './components/KanbanColumn';
import AddTaskForm from './components/AddTaskForm';
import ExportImportControls from './components/ExportImportControls';
import { getTasks, addTask, updateTask, deleteTask, clearAllTasks, bulkAddTasks } from './utils/db';

const COLUMNS = [
  { id: 'todo', title: 'Tugas Tersedia', color: 'var(--color-todo)' },
  { id: 'inprogress', title: 'Sedang Diproses', color: 'var(--color-inprogress)' },
  { id: 'pending', title: 'Pending', color: 'var(--color-pending)' },
  { id: 'done', title: 'Selesai', color: 'var(--color-done)' }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await getTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      // Ensure basic fields
      const task = {
        id: Date.now().toString(),
        status: 'todo', // Default status
        ...newTask
      };
      await addTask(task);
      setTasks(prev => [...prev, task]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleMoveTask = async (task, newStatus) => {
    if (task.status === newStatus) return;
    try {
      const updatedTask = { ...task, status: newStatus };
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to move task", error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `kanban-backup-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (importedTasks) => {
    try {
      if (!Array.isArray(importedTasks)) throw new Error("Invalid format");
      await clearAllTasks();
      await bulkAddTasks(importedTasks);
      // Reload from DB to be sure
      loadTasks();
      alert("Tasks imported successfully!");
    } catch (error) {
      console.error("Import failed", error);
      alert("Failed to import tasks.");
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Kanban Board</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: '#0079bf',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            + Add Task
          </button>
          <ExportImportControls onExport={handleExport} onImport={handleImport} />
        </div>
      </header>

      <KanbanBoard>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasks.filter(t => t.status === col.id)}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        ))}
      </KanbanBoard>

      {isModalOpen && (
        <AddTaskForm
          onSave={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
