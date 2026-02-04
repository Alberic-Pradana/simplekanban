import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const ArchivedTasksModal = ({ isOpen, onClose, archivedTasks, onRestore, onDeletePermanently }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>Archived Tasks</h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div style={styles.content}>
                    {archivedTasks.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b778c' }}>No archived tasks.</p>
                    ) : (
                        <ul style={styles.list}>
                            {archivedTasks.map(task => (
                                <li key={task.id} style={styles.listItem}>
                                    <div>
                                        <strong>{task.title}</strong>
                                        <p style={{ fontSize: '0.85rem', color: '#6b778c', margin: '4px 0 0 0' }}>{task.description}</p>
                                    </div>
                                    <div style={styles.actions}>
                                        <button
                                            onClick={() => onRestore(task)}
                                            style={{ ...styles.actionBtn, color: '#0079bf' }}
                                            title="Restore to Board"
                                        >
                                            <FontAwesomeIcon icon={faUndo} /> Restore
                                        </button>
                                        <button
                                            onClick={() => onDeletePermanently(task.id)}
                                            style={{ ...styles.actionBtn, color: '#dc3545' }}
                                            title="Delete Permanently"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    header: {
        padding: '16px 20px',
        borderBottom: '1px solid #ebecf0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        color: '#6b778c'
    },
    content: {
        padding: '20px',
        overflowY: 'auto'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    listItem: {
        padding: '12px',
        borderBottom: '1px solid #ebecf0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        flexShrink: 0
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    }
};

export default ArchivedTasksModal;
