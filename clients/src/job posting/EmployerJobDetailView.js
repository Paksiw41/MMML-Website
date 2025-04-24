import React, { useEffect, useState } from "react";
import "./EmployerJobDetailView.css";
import axios from "axios";
import EditJobModal from "./EditJobModal"; // Import the modal

function EmployerJobDetailView({ jobDetails, onBack, detailsLoading, detailsError, onDelete }) {
  const [isCreator, setIsCreator] = useState(false);
  const [employerId, setEmployerId] = useState(null);
  const [hasApplications, setHasApplications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [showPrompt, setShowPrompt] = useState(false); // Prompt state for can't edit message
  const [currentJobDetails, setCurrentJobDetails] = useState(jobDetails); // Store job details

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (jobDetails && userId) {
      axios
        .get(`http://localhost:8081/api/applications/job/${jobDetails.job_id}`)
        .then((response) => {
          const applications = response.data;
          const employerForJob = applications.find(
            (app) => app.job_id === jobDetails.job_id
          );
          if (employerForJob) {
            setEmployerId(employerForJob.employer_id);
          }
          setHasApplications(applications.length > 0); // True if there are applications
        })
        .catch((error) => {
          console.error("Error fetching employer ID:", error);
          alert("There was an error fetching the job details. Please try again later.");
        });
    }
  }, [jobDetails, userId]);

  useEffect(() => {
    if (userId && employerId) {
      setIsCreator(employerId === parseInt(userId));
    }
  }, [userId, employerId]);

  const handleSave = (updatedDetails) => {
    // Update the job details
    setCurrentJobDetails(updatedDetails);
    console.log("Updated Job Details:", updatedDetails);
  };

  const handleDelete = async () => {
    if (hasApplications) {
      alert("Cannot delete job posting: job has applicants.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!userId) {
        alert("User not logged in");
        return;
      }
      const response = await axios.delete(
        `http://localhost:8081/api/job_postings/${jobDetails.job_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Job posting successfully deleted!");
        onDelete(jobDetails.job_id);
      } else {
        alert("There was an issue with deleting the job posting.");
      }
    } catch (error) {
      console.error("Failed to delete the job:", error);
      alert("There was an error while trying to delete the job. Please try again later.");
    }
  };

  if (detailsLoading) return <div>Loading job details...</div>;
  if (detailsError) return <div>{detailsError}</div>;

  return (
    <div className="employer-job-detail-view">
      <button onClick={onBack} className="back-button">
        &lt; Back to job list
      </button>
      <h2>{currentJobDetails.jobName}</h2>
      <div className="job-metadata">
        <div>
          <h4>Contract Years</h4>
          <p>{currentJobDetails.typeOfWork || "2 Years"}</p>
        </div>
        <div>
          <h4>Salary</h4>
          <p>${currentJobDetails.salary}</p>
        </div>
        <div>
          <h4>Date Posted</h4>
          <p>{currentJobDetails.datePosted}</p>
        </div>
      </div>
      <div className="job-overview">
        <h3>Job Overview</h3>
        <p>{currentJobDetails.jobOverview}</p>
      </div>
      {isCreator && (
        <div className="job-actions">
          <button
            onClick={() => {
              if (hasApplications) {
                setShowPrompt(true); // Show the prompt instead of alert
              } else {
                setIsModalOpen(true);
              }
            }}
            className="edit-button"
            disabled={hasApplications} // Disable the button if there are applications
          >
            Edit
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
      <EditJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobDetails={currentJobDetails}
        onSave={handleSave}
      />
      {showPrompt && (
        <div className="prompt-overlay">
          <div className="prompt-content">
            <h3>Cannot Edit Job</h3>
            <p>An employee has already applied for this job. Editing is not allowed.</p>
            <button onClick={() => setShowPrompt(false)} className="close-prompt-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerJobDetailView;
