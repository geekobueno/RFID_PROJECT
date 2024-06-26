import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Scans from './components/Scans';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import TagVisualization from './components/TagVisualization';
import NFCScanner from './components/NFCScanner';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes for different components */}
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/courses" element={<CourseList />} />
           <Route path="/scans" element={<Scans />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id" element={<CourseForm />} />
          <Route path="/NFCScanner" element={<NFCScanner />} />
         <Route path="/Tags" element={<TagVisualization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
