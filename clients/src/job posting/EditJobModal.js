import React, { useState } from "react";
import "./EditJobModal.css"; // Add styling for the modal

const EditJobModal = ({ isOpen, onClose, jobDetails, onSave }) => {
    console.log("isOpen:", isOpen);
    console.log("onClose:", onClose);
    console.log("jobDetails:", jobDetails);
    console.log("onSave:", onSave);
  
  const [formData, setFormData] = useState({ ...jobDetails });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData); // Pass the updated data back to the parent component
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Job Details</h2>
        <form>
          <label>
            Job Name:
            <input
              type="text"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
            />
          </label>
          <label>
            Contract Years:
            <input
              type="text"
              name="typeOfWork"
              value={formData.typeOfWork}
              onChange={handleChange}
            />
          </label>
          <label>
            Salary:
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </label>
          <label>
            Job Overview:
            <textarea
              name="jobOverview"
              value={formData.jobOverview}
              onChange={handleChange}
            />
          </label>
        </form>
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
