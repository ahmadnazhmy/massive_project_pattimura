// src/component/Popup.jsx
import React from 'react';
import './Popup.scss';

const Popup = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        
        <span className="close-btn" onClick={onClose}>&times;</span>
        <p><b>Deskripsi</b></p>
        <img src={`http://localhost:3002/uploads/${report.photo}`} alt="Report" />
        <div className="desc">
          <h3>{report.title}</h3>
          <p>{report.description}</p>
          <p className="additional-info">{report.additionalInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
