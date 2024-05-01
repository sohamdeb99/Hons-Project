const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { MONGO_URI, JWT_SECRET } = require('./config/keys');
const authRoutes = require('./routes/Auth');
const fileUploadRouter = require('./routes/fileUploadRoutes');
const GenericCsvData = require('./models/GenericCsvData');
const User = require('./models/User');
const http = require('http');

const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.post('/verifyToken', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).send('No token provided');
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ isValid: false, error: err.message });
        }

        try {
            const user = await User.findById(decoded.user.id);
            if (!user) {
                console.error('User not found');
                return res.status(401).json({ isValid: false, error: 'User not found' });
            }
            res.json({ isValid: true, username: user.username });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ isValid: false, error: 'Server error' });
        }
    });
});

app.get('/getUserData/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const userData = {
            username: user.username,
            email: user.email,
            joinDate: user.joinDate
        };

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});

app.post('/upload', (req, res) => {
    const anomaliesDetected = true; 
    const protocolCounts = { TCP: 10, UDP: 5, ICMP: 1 }; 

    if (anomaliesDetected) {
        io.emit('alert', { message: "Anomalies detected within your data. Please check the Alert System tab." });
    }

io.emit('anomalyDetected', { message: 'Network anomaly detected.', severity: 'error' });

io.emit('protocolDetected', { protocol: 'TCP', count: 10 });


    res.json({ message: 'File processed', anomaliesDetected, protocolCounts });
});


app.get('/api/files', async (req, res) => {
    try {
        const files = await GenericCsvData.find({});
        res.json(files.map(file => ({
            fileName: file.fileName,
            uploader: file.uploader,
            uploadDate: file.uploadedAt,
            fileType: file.fileType
        })));
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/get-predictions', async (req, res) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-predictions');
      io.emit('alert', { message: "Anomaly detected within your data. Please check the Alert System tab." });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      res.status(500).send('Error fetching predictions');
    }
  });

app.use('/upload', fileUploadRouter);
app.use('/Auth', authRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
