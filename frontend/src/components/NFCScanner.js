import React, { useState, useEffect, useCallback } from 'react';

const NFCScanner = () => {
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isNFCSupported, setIsNFCSupported] = useState(false);

  const sendScanToServer = async (cardUID) => {
    try {
      const response = await fetch('http://localhost:5000/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardUID: cardUID,
          type: 'entry', 
          userType: 'student' 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json(); // We're not using the data, but we still await it
      setMessage('Scan successful!');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleNFCReading = useCallback(({ message: nfcMessage }) => {
    for (const record of nfcMessage.records) {
      if (record.recordType === "text") {
        const textDecoder = new TextDecoder(record.encoding);
        const cardUID = textDecoder.decode(record.data);
        sendScanToServer(cardUID);
      }
    }
  }, []);  // Empty dependency array as sendScanToServer doesn't depend on any props or state

  useEffect(() => {
    // Check if NDEFReader is supported
    if ('NDEFReader' in window) {
      setIsNFCSupported(true);
    } else {
      setMessage('Web NFC is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    let ndef;

    const setupNFC = async () => {
      if (isNFCSupported) {
        try {
          ndef = new window.NDEFReader();
          await ndef.scan();
          setMessage("NFC scan started. Approach an NFC tag.");
          setIsScanning(true);

          ndef.addEventListener("reading", handleNFCReading);
        } catch (error) {
          setMessage(`Error: ${error}`);
        }
      }
    };

    if (isNFCSupported) {
      setupNFC();
    }

    return () => {
      if (ndef) {
        ndef.removeEventListener("reading", handleNFCReading);
      }
    };
  }, [isNFCSupported, handleNFCReading]);

  const startScanning = async () => {
    if (!isScanning && isNFCSupported) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        setMessage("NFC scan started. Approach an NFC tag.");
        setIsScanning(true);
        ndef.addEventListener("reading", handleNFCReading);
      } catch (error) {
        setMessage(`Error: ${error}`);
      }
    }
  };

  return (
    <div>
      <h1>NFC Scanner</h1>
      {isNFCSupported ? (
        <button onClick={startScanning} disabled={isScanning}>
          {isScanning ? 'Scanning...' : 'Start NFC Scan'}
        </button>
      ) : (
        <p>NFC is not supported on this device or browser.</p>
      )}
      <p>{message}</p>
    </div>
  );
};

export default NFCScanner;