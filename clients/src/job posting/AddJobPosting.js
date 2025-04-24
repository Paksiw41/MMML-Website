import React, { useState, useEffect } from 'react';
import './AddJobPosting.css';
import HeaderEmployer from '../Header/HeaderEmployer';

function AddJobPosting() {
    const [jobName, setJobName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobOverview, setJobOverview] = useState('');
    const [salary, setSalary] = useState('');
    const [country, setCountry] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isApproved, setIsApproved] = useState(true); // Tracks approval status
    const [loading, setLoading] = useState(true); // Tracks loading state

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchApprovalStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/employers/status/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsApproved(data.status_id === 1 && data.progress_id === 6); // Update based on backend response
                } else {
                    setErrorMessage('Failed to fetch employer status.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while checking your approval status.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        if (userId) {
            fetchApprovalStatus();
        } else {
            setErrorMessage('User not authenticated.');
            setLoading(false); // Stop loading
        }
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setErrorMessage('User not authenticated.');
            return;
        }

        const jobData = {
            jobName,
            jobDescription,
            jobOverview,
            salary,
            country,
            employer_id: userId,
        };

        try {
            const response = await fetch('http://localhost:8081/api/job_postings/AddJobPosting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                setJobName('');
                setJobDescription('');
                setJobOverview('');
                setSalary('');
                setCountry('');
                setSuccessMessage('Job posting created successfully.');
            } else if (response.status === 403) {
                const errorData = await response.json();
                setErrorMessage(errorData.error);
                setIsApproved(false); // Update approval status
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting the job posting.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <HeaderEmployer
                userId={userId}
                auth={true}
                onSignOut={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}
            />
            <div className="main-content">
                <div className="add-job-posting">
                    <h2>Add Job Posting</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Job Name:</label>
                            <input
                                type="text"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                                placeholder="Enter job name"
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div>
                            <label>Job Description:</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Enter job description"
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div>
                            <label>Job Overview:</label>
                            <textarea
                                value={jobOverview}
                                onChange={(e) => setJobOverview(e.target.value)}
                                placeholder="Enter job overview"
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div>
                            <label>Salary:</label>
                            <input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="Enter salary"
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div>
                            <label>Country:</label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Enter country"
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        {!isApproved ? (
                            <p className="error">You are not yet approved by the admin. Please wait for approval.</p>
                        ) : (
                            <button type="submit">Submit Job</button>
                        )}
                    </form>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                </div>
            </div>
        </>
    );
}

export default AddJobPosting;
