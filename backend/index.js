const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://geekobueno:geekoAtlas%4045@cluster0.afvqadu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Mongoose schemas and models
const scanSchema = new mongoose.Schema({
  cardUID: String,
  timestamp: { type: Date, default: Date.now },
  type: String, // 'entry', 'exit', 'break_start', 'break_end'
  userType: String, // 'employee', 'teacher', 'student'
});

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  classroom: {
    type: String,
    enum: [
      'C 0.1', 'C 0.2', 'C 0.3', 'C 0.4',
      'C 1.1', 'C 1.2', 'C 1.3', 'C 1.4',
      'C 2.1', 'C 2.2', 'C 2.3', 'C 2.4'
    ],
    required: true
  },
  institute: {
    type: String,
    enum: ['ISTIN', 'ISSJ', 'ISEG'],
    required: true
  },
  year: {
    type: String,
    enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
    required: true
  }
});

const rfidTagSchema = new mongoose.Schema({
  cardUID: {
    type: String,
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['employee', 'teacher', 'student'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: String,
  department: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastScan: {
    type: Date,
    default: null
  }
});

const Scan = mongoose.model('Scan', scanSchema);
const Course = mongoose.model('Course', courseSchema);
const RFIDTag = mongoose.model('RFIDTag', rfidTagSchema);

// Scan routes
app.get('/scans', async (req, res) => {
  try {
    const scans = await Scan.find();
    res.json(scans);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/scans', async (req, res) => {
  try {
    const newScan = new Scan(req.body);
    await newScan.save();

    // Update the lastScan field of the corresponding RFID tag
    await RFIDTag.findOneAndUpdate(
      { cardUID: newScan.cardUID },
      { lastScan: newScan.timestamp }
    );

    res.status(201).json(newScan);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Course routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// RFID Tag routes
app.get('/api/rfidtags', async (req, res) => {
  try {
    const tags = await RFIDTag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/rfidtags/:cardUID', async (req, res) => {
  try {
    const tag = await RFIDTag.findOne({ cardUID: req.params.cardUID });
    if (!tag) {
      return res.status(404).json({ message: 'RFID tag not found' });
    }
    res.json(tag);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/rfidtags', async (req, res) => {
  try {
    const newTag = new RFIDTag(req.body);
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/api/rfidtags/:cardUID', async (req, res) => {
  try {
    const updatedTag = await RFIDTag.findOneAndUpdate(
      { cardUID: req.params.cardUID },
      req.body,
      { new: true }
    );
    if (!updatedTag) {
      return res.status(404).json({ message: 'RFID tag not found' });
    }
    res.json(updatedTag);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/rfidtags/:cardUID', async (req, res) => {
  try {
    const deletedTag = await RFIDTag.findOneAndDelete({ cardUID: req.params.cardUID });
    if (!deletedTag) {
      return res.status(404).json({ message: 'RFID tag not found' });
    }
    res.json({ message: 'RFID tag deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});