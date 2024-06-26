import React from 'react';
import { Link } from 'react-router-dom';

// Home component with navigation links
const Home = () => (
  <div>
    <h1>Welcome to RFID System</h1>
    <nav>
      <ul>
        <li><Link to="/scans">Scans</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/Tags">Tags</Link></li>
        <li><Link to="/NFCScanner">Scan with your phone</Link></li>
      </ul>
    </nav>
  </div>
);

export default Home;
