import React, { useState, useEffect } from 'react';

const AddTaskForm = ({ onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Tugas Tersedia');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setStatus(initialData.status);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            title,
            description,
            status
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginTop: 0 }}>
                    {initialData ? 'Edit Task' : 'Tambah Task Baru'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Judul</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Buat desain UI"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi singkat task..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Tugas Tersedia">Tugas Tersedia</option>
                            <option value="Sedang Diproses">Sedang Diproses</option>
                            <option value="Pending">Pending</option>
                            <option value="Selesai">Selesai</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
                        <button type="submit" className="btn-primary">
                            {initialData ? 'Simpan Perubahan' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskForm;
