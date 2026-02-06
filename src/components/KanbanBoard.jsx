import React from 'react';

const KanbanBoard = ({ children }) => {
    return (
        <div className="kanban-board-inner" style={{ display: 'flex', gap: '20px', height: 'fit-content' }}>
            {children}
        </div>
    );
};

export default KanbanBoard;
