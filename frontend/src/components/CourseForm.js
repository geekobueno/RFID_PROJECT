import React, { useState } from 'react';
import axios from 'axios';

const CourseForm = () => {
    const [courseData, setCourseData] = useState({
        courseCode: '',
        courseName: '',
        date: '',
        time: '',
        classroom: '',
        institute: 'ISTIN', // Default institute selection
        year: 'L1' // Default year selection
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/courses', courseData); // Adjust endpoint as per your backend
            console.log('Course saved successfully:', response.data);
            // Optionally, reset form fields after successful submission
            setCourseData({
                courseCode: '',
                courseName: '',
                date: '',
                time: '',
                classroom: '',
                institute: 'ISTIN',
                year: 'L1'
            });
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCourseData({ ...courseData, [name]: value });
    };

    return (
        <div>
            <h2>Add Course</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Course Code:
                    <input type="text" name="courseCode" value={courseData.courseCode} onChange={handleChange} required />
                </label>
                <label>
                    Course Name:
                    <input type="text" name="courseName" value={courseData.courseName} onChange={handleChange} required />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={courseData.date} onChange={handleChange} required />
                </label>
                <label>
                    Time:
                    <input type="time" name="time" value={courseData.time} onChange={handleChange} required />
                </label>
                <label>
                    Classroom:
                    <input type="text" name="classroom" value={courseData.classroom} onChange={handleChange} required />
                </label>
                <label>
                    Institute:
                    <select name="institute" value={courseData.institute} onChange={handleChange}>
                        <option value="ISTIN">ISTIN</option>
                        <option value="ISSJ">ISSJ</option>
                        <option value="ISEG">ISEG</option>
                    </select>
                </label>
                <label>
                    Year:
                    <select name="year" value={courseData.year} onChange={handleChange}>
                        <option value="L1">L1</option>
                        <option value="L2">L2</option>
                        <option value="L3">L3</option>
                        <option value="M1">M1</option>
                        <option value="M2">M2</option>
                    </select>
                </label>
                <button type="submit">Add Course</button>
            </form>
        </div>
    );
};

export default CourseForm;

