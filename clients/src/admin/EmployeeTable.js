import React from 'react';
import ProgressBar from '../Progress/ProgressBar';
import './Admin.css';

const EmployeeTable = ({ employees, viewProfile }) => {
  // Function to send acceptance notification
  const sendAcceptanceNotification = async (employeeId, jobId, employerId) => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications/hired', { // Update the port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, jobId, employerId }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(`Notification sent successfully: ${result.message}`);
      } else {
        alert(`Failed to send notification: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="employee-table">
      <h2>Employees</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {employee.firstName} {employee.lastName}
              </td>
              <td>
                <ProgressBar employeeId={employee.id} />
              </td>
              <td>
                <button onClick={() => viewProfile(employee)}>View Profile</button>
                <button
                  onClick={() => sendAcceptanceNotification(employee.id, employee.jobId, employee.employerId)}
                  className="acceptance-button"
                >
                  Notify Accepted
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
