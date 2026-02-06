import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faClipboardList, faSpinner, faClock, faCheckCircle, faArchive } from '@fortawesome/free-solid-svg-icons';

const STATUS_OPTIONS = [
    { id: 'all', label: 'All Board', icon: faClipboardList },
    { id: 'todo', label: 'Todo', icon: faList },
    { id: 'inprogress', label: 'Doing', icon: faSpinner },
    { id: 'pending', label: 'Pending', icon: faClock },
    { id: 'done', label: 'Done', icon: faCheckCircle },
    // Archive is special, usually handled by a modal, but we can have a view for it too if desired.
    // For this implementation, I will keep Archive as a "view" that renders the archived tasks list.
    { id: 'archive', label: 'Archive', icon: faArchive }
];

const StatusSidebar = ({ currentView, onViewChange }) => {
    return (
        <div className="status-sidebar">
            {/* Optional Header for Desktop only if needed, but tabs usually suffice */}
            <ul className="status-list">
                {STATUS_OPTIONS.map(option => (
                    <li
                        key={option.id}
                        className={`status-item status-item-${option.id} ${currentView === option.id ? 'active' : ''}`}
                        onClick={() => onViewChange(option.id)}
                    >
                        <FontAwesomeIcon icon={option.icon} fixedWidth />
                        <span>{option.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatusSidebar;
