// ExportFilterModal.jsx
import React from "react";
import "../CSS/ExportFilterModal.css";

const ExportFilterModal = ({ isOpen, onClose, onConfirm, onDocxExport }) => {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [selectedSort, setSelectedSort] = React.useState("frequency");

  const isMobile = window.innerWidth <= 768;

  const handlePDFExport = () => {
    onConfirm(selectedFilter, selectedSort);
    onClose();
  };

  const handleDocxExport = () => {
    onDocxExport(selectedFilter, selectedSort);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="export-modal-overlay">
      <div className="export-modal">
        <h2>🧾 Export Settings</h2>

        <label>📂 Filter Questions:</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="answered">Only with Answers</option>
          <option value="done">Done Only</option>
          <option value="revision">Revision Only</option>
          <option value="below5">Marks &lt; 5</option>
          <option value="above5">Marks ≥ 5</option>
        </select>

        <label>📊 Sort By:</label>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="marks">Marks</option>
          <option value="frequency">Frequency</option>
        </select>

        <div className="modal-actions">
          <button onClick={handlePDFExport} className="confirm-btn">
            📄 Generate PDF
          </button>
          {!isMobile ? (
            <>
              <button onClick={handleDocxExport} className="confirm-btn">
                📝 Generate DOCX
              </button>
              <button onClick={onClose} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginTop: "0.5rem",
                  textAlign: "center"
                }}
              >
                🛈  Want editable notes? Use desktop to download DOCX!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportFilterModal;
