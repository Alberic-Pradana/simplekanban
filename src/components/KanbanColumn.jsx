import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, status, tasks, onDeleteTask, onUpdateStatus, onEditTask }) => {
    const getColumnClass = (statusTitle) => {
        switch (statusTitle) {
            case 'Tugas Tersedia': return 'column-todo';
            case 'Sedang Diproses': return 'column-in-progress';
            case 'Pending': return 'column-pending';
            case 'Selesai': return 'column-done';
            default: return '';
        }
    };

    return (
        <div className={`kanban-column ${getColumnClass(status)}`}>
            <div className="column-header">
                {title} ({tasks.length})
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={onDeleteTask}
                        onUpdateStatus={onUpdateStatus}
                        onEdit={onEditTask}
                    />
                ))}
                {tasks.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
                        Kosong
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
