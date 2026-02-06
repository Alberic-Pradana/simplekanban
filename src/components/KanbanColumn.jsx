import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks, onMoveTask, onDeleteTask, onEditTask, onArchiveTask, isSingleView }) => {
    return (
        <div
            className={`kanban-column ${isSingleView ? 'single-view' : ''}`}
            style={{
                backgroundColor: column.color,
                /* Width is handled by CSS class now */
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{column.title}</h3>
                <span style={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    {tasks.length}
                </span>
            </div>

            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onMove={onMoveTask}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                        onArchive={onArchiveTask}
                    />
                ))}
                {tasks.length === 0 && (
                    <div style={{
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        padding: '20px 0',
                        border: '1px dashed var(--color-border)',
                        borderRadius: '6px'
                    }}>
                        Tidak ada tugas
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
