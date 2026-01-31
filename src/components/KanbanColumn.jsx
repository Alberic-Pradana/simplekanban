import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks, onMoveTask, onDeleteTask, onEditTask }) => {
    return (
        <div
            className="kanban-column"
            style={{
                backgroundColor: column.color,
                minWidth: '300px',
                maxWidth: '300px',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                height: 'fit-content' // allow it to grow but not stretch unnecessarily
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>{column.title}</h3>
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
                    />
                ))}
                {tasks.length === 0 && (
                    <div style={{
                        color: '#888',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        padding: '20px 0',
                        border: '1px dashed rgba(0,0,0,0.1)',
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
