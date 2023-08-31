import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';

const ConfirmationPopup = ({ onClose, selectedTables, selectedDate, startTime, endTime }) => {  
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [reservantName, setReservantName] = useState("");

  // Calculate the amount to pay based on the number of selected tables
  const amountToPay = selectedTables.length * 50; // Assuming each table costs 50 LKR

  // Generate a random reservation number
  const reservationNumber = Math.floor(Math.random() * 1000000);

  // Function to handle the "Confirm" button click
  const handleConfirmClick = async () => {
    // Close the popup
    onClose();
  
    // Create an object with the data to be sent
    const reservationData = {
      selectedTableNumbers: selectedTables.map(table => table.table_number),
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      reservant_name: reservantName,
      number_of_participants: selectedTables.reduce((acc, table) => acc + table.number_of_participants, 0),
      tablefortwo: 'No', // Change this based on your form input
    };
  
    try {
      // Send the reservation data to the API endpoint
      const response = await axiosClient.post('/reserve-tables', reservationData);
      console.log(response.data); // Assuming the response contains some feedback
  
      // Show the success popup
      setShowSuccessPopup(true);
  
      // Close the success popup after a delay (e.g., 2000 milliseconds)
      setTimeout(() => {
        setShowSuccessPopup(false);
  
        // Navigate to the activities page
        navigate('/activities');
      }, 2000);
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-8">
        <span className="popup-close" onClick={onClose}>
          &#10005;
        </span>
        <h2 className="text-xl font-bold mb-4">Confirmation Popup</h2>
        <p className="text-gray-600 mb-4">Please review your reservation details.</p>
        <div className="mb-4">
          <label htmlFor="reservantName" className="font-semibold">
            Reservant Name:
          </label>
          <input
            type="text"
            id="reservantName"
            className="border rounded p-1 w-full"
            value={reservantName}
            onChange={(e) => setReservantName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <p className="font-semibold">Selected Tables:</p>
          <ul className="list-disc pl-6">
            {selectedTables.map(table => (
              <li key={table.id}>Table No. {table.table_number}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Amount to Pay (LKR): {amountToPay}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Reservation Number: {reservationNumber}</p>
        </div>
        <div className="flex gap-4">
          {/* Define buttons and their actions here */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={handleConfirmClick} // Use the handleConfirmClick function
          >
            Confirm
          </button>
          <button
            className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="p-16 bg-white rounded-lg shadow-lg">
              <h4 className="mb-4 text-lg font-bold">Reservation Successful!</h4>
              <p>Thank you for using Seatwise.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPopup;
