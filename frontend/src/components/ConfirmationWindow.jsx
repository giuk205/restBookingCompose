import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationWindow = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
            </svg>
        </div>

        <div className="text-lg font-medium text-gray-800">
            {title}
        </div>
        <div className="mt-2 text-sm leading-relaxed text-gray-500">
            {message}
        </div>
        <div style={buttonContainerStyle}>
            <button className="w-full mt-2 mr-2 p-2.5 flex-1 text-white bg-red-600 rounded-md ring-offset-2 ring-red-600 focus:ring-2" 
                onClick={onConfirm}>Si</button>
            <button 
                className="w-full mt-2 p-2.5 ml-2 flex-1 text-gray-800 rounded-md border ring-offset-2 ring-indigo-600 focus:ring-2"
                onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationWindow.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const buttonContainerStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'space-around',
};

export default ConfirmationWindow;
