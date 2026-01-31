import { useState } from 'react';

const AddTaskForm = ({ onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={{ marginTop: 0 }}>Add New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.group}>
                        <label style={styles.label}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                            placeholder="Enter task title"
                            autoFocus
                            required
                        />
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ ...styles.input, minHeight: '100px' }}
                            placeholder="Enter task description"
                        />
                    </div>
                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.btnCancel}>Cancel</button>
                        <button type="submit" style={styles.btnSave}>Add Task</button>
                    </div>
                </form>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    group: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '24px'
    },
    btnCancel: {
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: 'white',
        color: '#333',
        cursor: 'pointer'
    },
    btnSave: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        background: '#0079bf',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default AddTaskForm;
