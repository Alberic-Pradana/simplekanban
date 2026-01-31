const KanbanBoard = ({ children }) => {
    return (
        <div
            className="kanban-container"
            style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                overflowX: 'auto',
                minHeight: 'calc(100vh - 100px)',
                paddingBottom: '20px'
            }}
        >
            {children}
        </div>
    );
};

export default KanbanBoard;
