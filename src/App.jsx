// ... imports
import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import KanbanColumn from './components/KanbanColumn';
import AddTaskForm from './components/AddTaskForm';
import ExportImportControls from './components/ExportImportControls';
import ArchivedTasksModal from './components/ArchivedTasksModal';
import ProjectSidebar from './components/ProjectSidebar';
import StatusSidebar from './components/StatusSidebar'; // Import StatusSidebar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faSun, faMoon, faBars } from '@fortawesome/free-solid-svg-icons'; // Added faBars
import { getTasks, addTask, updateTask, deleteTask, clearAllTasks, bulkAddTasks, getProjects, addProject, deleteProject, updateProject } from './utils/db';
import './styles/kanban.css';
import './styles/layout.css';
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

  // New States for Layout & Filter
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'todo', 'inprogress', 'pending', 'done', 'archive'

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

  // ... (rest of handlers: move, delete, edit, import/export, archive)
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
    <div className="app-container">
      {/* 1. Project Sidebar */}
      <ProjectSidebar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
        isOpen={isProjectSidebarOpen}
        onClose={() => setIsProjectSidebarOpen(false)}
      />

      <div className="main-content">
        {/* 2. Header */}
        <header className="app-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsProjectSidebarOpen(true)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div>
              <h1
                style={{ margin: 0, fontSize: '1.2rem', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 'bold' }}
                onClick={() => setViewMode('all')}
                title="View All Tasks"
              >
                {currentProject ? currentProject.name : 'Simple Kanban'}
              </h1>
              {currentProject && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'none' }}>Managing tasks for {currentProject.name}</span>}
            </div>
          </div>

          <div className="header-right">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-add-task"
              disabled={!currentProject}
            >
              + Add Task
            </button>
            <ExportImportControls onExport={handleExport} onImport={handleImport} />
            <button
              onClick={() => setIsArchiveModalOpen(true)}
              className="btn-header-archive"
              title="View Archived Tasks"
            >
              <FontAwesomeIcon icon={faBoxArchive} />
              {archivedTasks.length > 0 && (
                <span className="archive-badge">
                  {archivedTasks.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Flex container for Status Sidebar + Board */}
        <div className="content-body">

          {/* 3. Status Sidebar (Sidebar on Desktop, Tabs on Mobile) */}
          <StatusSidebar
            currentView={viewMode}
            onViewChange={setViewMode}
          />

          {/* 4. Kanban Board Area */}
          <div className="kanban-wrapper">
            {currentProject ? (
              <KanbanBoard viewMode={viewMode}>
                {COLUMNS
                  .filter(col => viewMode === 'all' || viewMode === col.id)
                  .map(col => (
                    <KanbanColumn
                      key={col.id}
                      column={col}
                      tasks={activeTasks.filter(t => t.status === col.id)}
                      onMoveTask={handleMoveTask}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                      onArchiveTask={handleArchiveTask}
                      isSingleView={viewMode !== 'all'}
                    />
                  ))}
              </KanbanBoard>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#666', width: '100%' }}>
                <h2>Welcome!</h2>
                <p>Select a project to start.</p>
              </div>
            )}
          </div>
        </div>

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

      <div className="theme-switch-wrapper">
        <label className="theme-switch" htmlFor="checkbox">
          <input type="checkbox" id="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <div className="slider round">
            <FontAwesomeIcon icon={faSun} className="icon-sun" />
            <FontAwesomeIcon icon={faMoon} className="icon-moon" />
          </div>
        </label>
      </div>
    </div>
  );
}

export default App;
