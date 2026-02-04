import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash, faPen, faArrowRight, faArrowLeft, faSave, faTimes,
    faCheck, faArchive, faComment, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

const STATUS_ORDER = ['todo', 'inprogress', 'pending', 'done'];

const TaskCard = ({ task, onMove, onDelete, onEdit, onArchive }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDesc, setEditedDesc] = useState(task.description);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

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

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            text: newComment,
            timestamp: new Date().toISOString()
        };

        const updatedComments = task.comments ? [...task.comments, comment] : [comment];
        onEdit({ ...task, comments: updatedComments });
        setNewComment('');
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
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

    const commentsCount = task.comments?.length || 0;

    return (
        <div className="task-card" style={styles.card}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#172b4d' }}>{task.title}</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#5e6c84', whiteSpace: 'pre-wrap' }}>
                {task.description}
            </p>

            {/* Comment Section Toggle */}
            <div style={{ marginBottom: '8px' }}>
                <button
                    onClick={() => setShowComments(!showComments)}
                    style={{ ...styles.btn, fontSize: '0.8rem', padding: '2px 0', color: '#0079bf' }}
                >
                    <FontAwesomeIcon icon={faComment} style={{ marginRight: '4px' }} />
                    {commentsCount > 0 ? `${commentsCount} Comments` : 'Add Comment'}
                </button>
            </div>

            {/* Comments Display */}
            {showComments && (
                <div style={styles.commentsSection}>
                    {task.comments && task.comments.map(comment => (
                        <div key={comment.id} style={styles.commentItem}>
                            <div style={styles.commentMeta}>{formatDate(comment.timestamp)}</div>
                            <div style={styles.commentText}>{comment.text}</div>
                        </div>
                    ))}

                    <div style={styles.addCommentRow}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            style={styles.commentInput}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button onClick={handleAddComment} style={styles.sendBtn} disabled={!newComment.trim()}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}

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
        marginTop: '8px',
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
    },
    commentsSection: {
        marginTop: '8px',
        marginBottom: '8px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        padding: '8px',
        fontSize: '0.85rem'
    },
    commentItem: {
        marginBottom: '8px',
        borderBottom: '1px solid #eee',
        paddingBottom: '4px'
    },
    commentMeta: {
        fontSize: '0.75rem',
        color: '#888',
        marginBottom: '2px'
    },
    commentText: {
        color: '#333',
        whiteSpace: 'pre-wrap'
    },
    addCommentRow: {
        display: 'flex',
        gap: '4px',
        marginTop: '8px'
    },
    commentInput: {
        flex: 1,
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '0.85rem'
    },
    sendBtn: {
        background: '#0079bf',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer'
    }
};

export default TaskCard;
