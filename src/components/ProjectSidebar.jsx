import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faFolder, faFolderOpen, faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProjectSidebar = ({ projects, currentProject, onSelectProject, onAddProject, onDeleteProject, onEditProject }) => {
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
        <div style={styles.sidebar}>
            <h2 style={styles.header}>Projects</h2>

            <ul style={styles.list}>
                {projects.map(project => (
                    <li
                        key={project.id}
                        style={{
                            ...styles.listItem,
                            backgroundColor: currentProject?.id === project.id ? 'var(--color-todo)' : 'transparent',
                            color: 'var(--color-text)'
                        }}
                        onClick={() => onSelectProject(project)}
                    >
                        {editingProjectId === project.id ? (
                            <div style={styles.editForm} onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={editProjectName}
                                    onChange={(e) => setEditProjectName(e.target.value)}
                                    style={styles.editInput}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit(project);
                                        if (e.key === 'Escape') cancelEdit();
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button onClick={() => handleSaveEdit(project)} style={{ ...styles.btn, color: 'green' }}>
                                        <FontAwesomeIcon icon={faCheck} size="xs" />
                                    </button>
                                    <button onClick={cancelEdit} style={{ ...styles.btn, color: 'red' }}>
                                        <FontAwesomeIcon icon={faTimes} size="xs" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={styles.projectInfo}>
                                    <FontAwesomeIcon icon={currentProject?.id === project.id ? faFolderOpen : faFolder} />
                                    <span style={styles.projectName}>{project.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        onClick={(e) => startEdit(project, e)}
                                        style={styles.actionBtn}
                                        title="Rename Project"
                                    >
                                        <FontAwesomeIcon icon={faPen} size="xs" />
                                    </button>
                                    {projects.length > 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                                            style={{ ...styles.actionBtn, color: 'var(--color-danger)' }}
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

            {isCreating ? (
                <div style={styles.createForm}>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Project Name"
                        style={styles.input}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={handleCreate} style={styles.confirmBtn}>Add</button>
                        <button onClick={() => setIsCreating(false)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsCreating(true)} style={styles.addBtn}>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                    New Project
                </button>
            )}
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        backgroundColor: 'var(--color-bg)',
        borderRight: '1px solid var(--color-text-secondary)', // or similar divider color
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
    },
    header: {
        fontSize: '1.2rem',
        marginBottom: '20px',
        color: 'var(--color-text)'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 20px 0',
        flex: 1,
        overflowY: 'auto'
    },
    listItem: {
        padding: '10px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.2s'
    },
    projectInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflow: 'hidden'
    },
    projectName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-danger)',
        cursor: 'pointer',
        padding: '4px',
        fontSize: '0.8rem',
        ':hover': { opacity: 1 }
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        padding: '4px',
        fontSize: '0.8rem',
        opacity: 0.7,
        ':hover': { opacity: 1 }
    },
    editForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        width: '100%'
    },
    editInput: {
        flex: 1,
        padding: '4px',
        borderRadius: '4px',
        border: '1px solid var(--color-todo)',
        fontSize: '0.9rem',
        minWidth: 0
    },
    addBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: 'var(--color-todo)',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'var(--color-text)',
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.2s'
    },
    createForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid var(--color-border)'
    },
    confirmBtn: {
        flex: 1,
        padding: '6px',
        backgroundColor: 'var(--color-todo)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    cancelBtn: {
        flex: 1,
        padding: '6px',
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default ProjectSidebar;
