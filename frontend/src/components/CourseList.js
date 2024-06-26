import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [sortBy, setSortBy] = useState('classroom'); // Default sort by classroom

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses'); // Adjust endpoint as per your backend
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const sortedCourses = courses.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'institute':
                return a.institute.localeCompare(b.institute);
            case 'year':
                return a.year.localeCompare(b.year);
            default:
                return a.classroom.localeCompare(b.classroom);
        }
    });

    return (
        <div>
            <h2>Course List</h2>
            <Link to="/courses/new">Add Course</Link> {/* Link to Course Form */}
            <br></br>
            <br></br>
            <label>
                Sort by:
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="classroom">Classroom</option>
                    <option value="date">Date</option>
                    <option value="institute">Institute</option>
                    <option value="year">Year</option>
                </select>
            </label>
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Classroom</th>
                        <th>Institute</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCourses.map(course => (
                        <tr key={course._id}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{new Date(course.date).toLocaleDateString()}</td>
                            <td>{course.time}</td>
                            <td>{course.classroom}</td>
                            <td>{course.institute}</td>
                            <td>{course.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseList;
