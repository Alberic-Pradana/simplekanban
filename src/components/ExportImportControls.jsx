import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';

const ExportImportControls = ({ onExport, onImport }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const tasks = JSON.parse(event.target.result);
                onImport(tasks);
            } catch (error) {
                console.error("Error parsing JSON", error);
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = null;
    };

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button
                onClick={onExport}
                style={styles.btn}
                title="Export Tasks"
            >
                <FontAwesomeIcon icon={faFileExport} style={{ marginRight: '5px' }} />
                Export
            </button>

            <button
                onClick={() => fileInputRef.current.click()}
                style={styles.btn}
                title="Import Tasks"
            >
                <FontAwesomeIcon icon={faFileImport} style={{ marginRight: '5px' }} />
                Import
            </button>

            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

const styles = {
    btn: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #dfe1e6',
        background: 'white',
        color: '#42526e',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center'
    }
};

export default ExportImportControls;
