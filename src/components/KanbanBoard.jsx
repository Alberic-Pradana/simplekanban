import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import AddTaskForm from './AddTaskForm';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('kanban-tasks');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const saveTask = (taskData) => {
        if (editingTask) {
            // Update existing
            setTasks(tasks.map(t =>
                t.id === editingTask.id ? { ...t, ...taskData } : t
            ));
        } else {
            // Add new
            const newTask = {
                id: Date.now().toString(),
                ...taskData
            };
            setTasks([...tasks, newTask]);
        }
        closeModal();
    };

    const deleteTask = (taskId) => {
        if (window.confirm('Yakin ingin menghapus task ini?')) {
            setTasks(tasks.filter(t => t.id !== taskId));
        }
    };

    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ));
    };

    const openAddModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const columns = [
        { title: 'Tugas Tersedia', status: 'Tugas Tersedia' },
        { title: 'Sedang Diproses', status: 'Sedang Diproses' },
        { title: 'Pending', status: 'Pending' },
        { title: 'Selesai', status: 'Selesai' }
    ];

    return (
        <div className="kanban-board">
            <div className="kanban-header">
                <h1 style={{ margin: 0 }}>Simple Kanban</h1>
                <button className="btn-add-task" onClick={openAddModal}>
                    + Tambah Task
                </button>
            </div>

            <div className="kanban-columns-container">
                {columns.map(col => (
                    <KanbanColumn
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        tasks={tasks.filter(t => t.status === col.status)}
                        onDeleteTask={deleteTask}
                        onUpdateStatus={updateTaskStatus}
                        onEditTask={openEditModal}
                    />
                ))}
            </div>

            {isModalOpen && (
                <AddTaskForm
                    onClose={closeModal}
                    onSave={saveTask}
                    initialData={editingTask}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
