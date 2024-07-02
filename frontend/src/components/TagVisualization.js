import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  hover: {
    backgroundColor: '#f5f5f5',
  },
};

const TagVisualization = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://192.168.137.40:5000/api/rfidtags');
        setTags(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tags');
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>RFID Tags</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Card UID</th>
            <th style={styles.th}>User Type</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Last Scan</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => (
            <tr 
              key={tag.cardUID} 
              style={index % 2 === 0 ? styles.evenRow : {}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.hover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? styles.evenRow.backgroundColor : ''}
            >
              <td style={styles.td}>{tag.cardUID}</td>
              <td style={styles.td}>{tag.userType}</td>
              <td style={styles.td}>{tag.name}</td>
              <td style={styles.td}>{tag.lastScan ? new Date(tag.lastScan).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TagVisualization;