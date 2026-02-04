import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faArrowRight, faArrowLeft, faSave, faTimes, faCheck, faArchive } from '@fortawesome/free-solid-svg-icons';

const STATUS_ORDER = ['todo', 'inprogress', 'pending', 'done'];

const TaskCard = ({ task, onMove, onDelete, onEdit, onArchive }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDesc, setEditedDesc] = useState(task.description);

    const currentIndex = STATUS_ORDER.indexOf(task.status);
    const prevStatus = currentIndex > 0 ? STATUS_ORDER[currentIndex - 1] : null;
    const nextStatus = currentIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIndex + 1] : null;

    const handleSave = () => {
        onEdit({ ...task, title: editedTitle, description: editedDesc });
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditedTitle(task.title);
        setEditedDesc(task.description);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="task-card" style={styles.card}>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={styles.input}
                    autoFocus
                />
                <textarea
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                />
                <div style={styles.actionRow}>
                    <button onClick={handleSave} style={{ ...styles.btn, color: 'green' }} title="Save">
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button onClick={cancelEdit} style={{ ...styles.btn, color: 'red' }} title="Cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="task-card" style={styles.card}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#172b4d' }}>{task.title}</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#5e6c84', whiteSpace: 'pre-wrap' }}>
                {task.description}
            </p>

            <div style={styles.actionRow}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setIsEditing(true)} style={styles.btn} title="Edit">
                        <FontAwesomeIcon icon={faPen} size="sm" />
                    </button>
                    <button onClick={() => onDelete(task.id)} style={{ ...styles.btn, color: '#dc3545' }} title="Delete">
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                    {['inprogress', 'pending'].includes(task.status) && (
                        <button
                            onClick={() => onMove(task, 'done')}
                            style={{ ...styles.btn, color: '#6b778c' }}
                            title="Mark as Done"
                        >
                            <FontAwesomeIcon icon={faCheck} size="sm" />
                        </button>
                    )}
                    {task.status === 'done' && (
                        <button
                            onClick={() => onArchive(task)}
                            style={{ ...styles.btn, color: '#6b778c' }}
                            title="Archive Task"
                        >
                            <FontAwesomeIcon icon={faArchive} size="sm" />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {prevStatus && (
                        <button onClick={() => onMove(task, prevStatus)} style={styles.btn} title="Move Back">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    )}
                    {nextStatus && (
                        <button onClick={() => onMove(task, nextStatus)} style={styles.btn} title="Move Next">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column'
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '8px',
        borderTop: '1px solid #f0f0f0'
    },
    btn: {
        padding: '4px 8px',
        borderRadius: '4px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: '#6b778c',
        transition: 'background 0.2s, color 0.2s'
    },
    input: {
        width: '100%',
        padding: '6px',
        marginBottom: '8px',
        borderRadius: '4px',
        border: '1px solid #dfe1e6',
        fontSize: '0.9rem'
    }
};

export default TaskCard;
