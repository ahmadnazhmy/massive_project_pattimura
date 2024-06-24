import React from 'react';
import deleteIcon from '../assets/icons/delete_icon.png';
import axios from 'axios'; // Import Axios for making HTTP requests

const DeleteButton = ({ onClick, column, id }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the user with ID '${id}'?`)) {
      axios.delete(`http://localhost:3002/${column}/${id}`)
        .then(response => {
          alert(response.data.message);
          onClick(id); // Trigger parent component to update state or UI after deletion
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        });
    }
  };

  return (
    <div className="delete-button-wrapper">
      <button className="delete-button" onClick={handleDelete}>
        <img src={deleteIcon} alt="Delete Icon" className="delete-icon" />
      </button>
    </div>
  );
};

export default DeleteButton;

