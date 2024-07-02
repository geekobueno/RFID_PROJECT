import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Scans component to fetch and display scans from the backend
const Scans = () => {
  const [scans, setScans] = useState([]);

  // Fetch scans on component mount
  useEffect(() => {
    fetchScans();
  }, []);

  // Function to fetch scans from the backend
  const fetchScans = async () => {
    try {
      const response = await axios.get('http://192.168.137.40:5000/scans');
      setScans(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  return (
    <div>
      <h1>RFID Scans</h1>
      <table>
        <thead>
          <tr>
            <th>Card UID</th>
            <th>Timestamp</th>
            <th>Type</th>
           </tr>
        </thead>
        <tbody>
          {scans.map(scan => (
            <tr key={scan._id}>
              <td>{scan.cardUID}</td>
              <td>{new Date(scan.timestamp).toLocaleString()}</td>
              <td>{scan.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scans;
