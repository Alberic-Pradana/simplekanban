import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import KanbanColumn from './components/KanbanColumn';
import AddTaskForm from './components/AddTaskForm';
import ExportImportControls from './components/ExportImportControls';
import ArchivedTasksModal from './components/ArchivedTasksModal';
import ProjectSidebar from './components/ProjectSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { getTasks, addTask, updateTask, deleteTask, clearAllTasks, bulkAddTasks, getProjects, addProject, deleteProject, updateProject } from './utils/db';

const COLUMNS = [
  { id: 'todo', title: 'Tugas Tersedia', color: 'var(--color-todo)' },
  { id: 'inprogress', title: 'Sedang Diproses', color: 'var(--color-inprogress)' },
  { id: 'pending', title: 'Pending', color: 'var(--color-pending)' },
  { id: 'done', title: 'Selesai', color: 'var(--color-done)' }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('currentProjectId', currentProject.id);
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [currentProject]);

  const activeTasks = tasks.filter(t => !t.isArchived);
  const archivedTasks = tasks.filter(t => t.isArchived);

  const loadProjects = async () => {
    try {
      const storedProjects = await getProjects();
      setProjects(storedProjects);

      // If no project selected yet, select the first one (usually 'default')
      // If storedProjects is empty, DB migration failed or hasn't run yet? 
      // Actually DB migration runs on any DB open. 
      // But getProjects calls initDB which runs migration. 
      // So storedProjects should at least have 'default' if it's new DB or upgraded.
      if (storedProjects.length > 0 && !currentProject) {
        const savedProjectId = localStorage.getItem('currentProjectId');
        const savedProject = savedProjectId ? storedProjects.find(p => p.id === savedProjectId) : null;
        setCurrentProject(savedProject || storedProjects[0]);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const loadTasks = async () => {
    if (!currentProject) return;
    try {
      const storedTasks = await getTasks(currentProject.id);
      setTasks(storedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const newProject = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...projectData
      };
      await addProject(newProject);
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject); // Switch to new project
    } catch (error) {
      console.error("Failed to add project", error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      await updateProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      if (currentProject && currentProject.id === updatedProject.id) {
        setCurrentProject(updatedProject);
      }
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project and ALL its tasks?")) return;
    try {
      await deleteProject(projectId);
      const remainingProjects = projects.filter(p => p.id !== projectId);
      setProjects(remainingProjects);
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleAddTask = async (newTask) => {
    if (!currentProject) return;
    try {
      // Ensure basic fields
      const task = {
        id: Date.now().toString(),
        projectId: currentProject.id, // Link to project
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

  // ... (Other handlers like move, delete, edit, import/export remain largely same, 
  // but export/import might need to consider project context if we want per-project export)

  // Update: Export only current project tasks or all? 
  // Let's stick to current behavior: export what is in `tasks` state (which is now filtered by project)
  // Logic works: `tasks` state contains only current project tasks.

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
    const projectName = currentProject ? currentProject.name.replace(/\s+/g, '-') : 'kanban';
    link.href = url;
    link.download = `${projectName}-backup-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (importedTasks) => {
    if (!currentProject) return;
    try {
      if (!Array.isArray(importedTasks)) throw new Error("Invalid format");
      // Careful: clearAllTasks takes a projectId now to clear safely
      await clearAllTasks(currentProject.id);

      // Ensure imported tasks have the correct projectId
      const tasksWithProject = importedTasks.map(t => ({
        ...t,
        projectId: currentProject.id
      }));

      await bulkAddTasks(tasksWithProject);
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
      const updatedTask = { ...task, isArchived: false };
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <ProjectSidebar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
      />

      <div className="app-main" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0 }}>{currentProject ? currentProject.name : 'Simple Kanban'}</h1>
            {currentProject && <span style={{ fontSize: '0.9rem', color: '#666' }}>Managing tasks for {currentProject.name}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="theme-switch-wrapper">
              <label className="theme-switch" htmlFor="checkbox">
                <input type="checkbox" id="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <div className="slider round">
                  <FontAwesomeIcon icon={faSun} className="icon-sun" />
                  <FontAwesomeIcon icon={faMoon} className="icon-moon" />
                </div>
              </label>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!currentProject}
              style={{
                backgroundColor: currentProject ? '#0079bf' : '#ccc',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: currentProject ? 'pointer' : 'not-allowed'
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

        {currentProject ? (
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
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
            <h2>Welcome to Simple Kanban!</h2>
            <p>Please select or create a project from the sidebar to get started.</p>
          </div>
        )}

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
    </div>
  );
}

export default App;
