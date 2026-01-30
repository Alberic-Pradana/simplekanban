import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const TaskCard = ({ task, onDelete, onUpdateStatus, onEdit }) => {
  const statusOptions = [
    "Tugas Tersedia",
    "Sedang Diproses",
    "Pending",
    "Selesai"
  ];

  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value);
  };

  return (
    <div className="task-card">
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>

      <div className="task-actions">
        {/* Status Dropdown for moving tasks */}
        <div style={{ marginRight: 'auto' }}>
          <select
            value={task.status}
            onChange={handleStatusChange}
            style={{ padding: '2px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
            onClick={(e) => e.stopPropagation()}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <button
          className="btn"
          onClick={() => onEdit(task)}
          title="Edit Task"
        >
          <FontAwesomeIcon icon={faPen} style={{ color: '#0079bf' }} />
        </button>

        <button
          className="btn"
          onClick={() => onDelete(task.id)}
          title="Hapus Task"
        >
          <FontAwesomeIcon icon={faTrash} style={{ color: '#ff4d4f' }} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
