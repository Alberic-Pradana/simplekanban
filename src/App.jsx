import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import KanbanColumn from './components/KanbanColumn';
import AddTaskForm from './components/AddTaskForm';
import ExportImportControls from './components/ExportImportControls';
import ArchivedTasksModal from './components/ArchivedTasksModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons';
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
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const activeTasks = tasks.filter(t => !t.isArchived);
  const archivedTasks = tasks.filter(t => t.isArchived);

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

  const handleArchiveTask = async (task) => {
    try {
      const updatedTask = {
        ...task,
        isArchived: true,
        archivedDate: new Date().toISOString().split('T')[0] // Save date only YYYY-MM-DD
      };
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to archive task", error);
    }
  };

  const handleUnarchiveTask = async (task) => {
    try {
      const updatedTask = { ...task, isArchived: false }; // Keep archivedDate or remove? Usually remove if unarchived.
      // Let's remove archivedDate when restoring
      delete updatedTask.archivedDate;

      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to unarchive task", error);
    }
  };

  const handleDeletePermanently = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Simple Kanban</h1>
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
          <button
            onClick={() => setIsArchiveModalOpen(true)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative'
            }}
            title="View Archived Tasks"
          >
            <FontAwesomeIcon icon={faBoxArchive} />
            {archivedTasks.length > 0 && (
              <span style={{
                backgroundColor: '#dc3545',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                position: 'absolute',
                top: '-5px',
                right: '-5px'
              }}>
                {archivedTasks.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <KanbanBoard>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={activeTasks.filter(t => t.status === col.id)}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onArchiveTask={handleArchiveTask}
          />
        ))}
      </KanbanBoard>

      {isModalOpen && (
        <AddTaskForm
          onSave={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ArchivedTasksModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        archivedTasks={archivedTasks}
        onRestore={handleUnarchiveTask}
        onDeletePermanently={handleDeletePermanently}
      />
    </div>
  );
}

export default App;
