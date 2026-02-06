import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faFolder, faFolderOpen, faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProjectSidebar = ({
    projects,
    currentProject,
    onSelectProject,
    onAddProject,
    onDeleteProject,
    onEditProject,
    isOpen,         // prop for mobile visibility
    onClose         // prop to close sidebar on mobile
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editProjectName, setEditProjectName] = useState('');

    const handleCreate = () => {
        if (!newProjectName.trim()) return;
        onAddProject({ name: newProjectName.trim() });
        setNewProjectName('');
        setIsCreating(false);
    };

    const startEdit = (project, e) => {
        e.stopPropagation();
        setEditingProjectId(project.id);
        setEditProjectName(project.name);
    };

    const cancelEdit = () => {
        setEditingProjectId(null);
        setEditProjectName('');
    };

    const handleSaveEdit = (project) => {
        if (!editProjectName.trim()) return;
        onEditProject({ ...project, name: editProjectName.trim() });
        setEditingProjectId(null);
    };

    return (
        <>
            {/* Overlay for mobile when sidebar is open */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <div className={`project-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="project-sidebar-header">
                    <span>Projects</span>
                    <button className="sidebar-close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <ul className="project-list">
                    {projects.map(project => (
                        <li
                            key={project.id}
                            className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
                            onClick={() => {
                                onSelectProject(project);
                                // On mobile, auto-close after selection
                                if (window.innerWidth <= 768) onClose();
                            }}
                        >
                            {editingProjectId === project.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        value={editProjectName}
                                        onChange={(e) => setEditProjectName(e.target.value)}
                                        style={{ flex: 1, padding: '4px', borderRadius: '4px', border: '1px solid var(--color-todo)', fontSize: '0.9rem', minWidth: 0 }}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(project);
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button onClick={() => handleSaveEdit(project)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'green' }}>
                                            <FontAwesomeIcon icon={faCheck} size="xs" />
                                        </button>
                                        <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>
                                            <FontAwesomeIcon icon={faTimes} size="xs" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                        <FontAwesomeIcon icon={currentProject?.id === project.id ? faFolderOpen : faFolder} />
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={(e) => startEdit(project, e)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px', fontSize: '0.8rem', opacity: 0.7 }}
                                            title="Rename Project"
                                        >
                                            <FontAwesomeIcon icon={faPen} size="xs" />
                                        </button>
                                        {projects.length > 1 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px', fontSize: '0.8rem', opacity: 0.7 }}
                                                title="Delete Project"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="xs" />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)' }}>
                    {isCreating ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Project Name"
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={handleCreate} style={{ flex: 1, padding: '6px', backgroundColor: 'var(--color-todo)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                                <button onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '6px', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-todo)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-text)', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                            New Project
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProjectSidebar;
