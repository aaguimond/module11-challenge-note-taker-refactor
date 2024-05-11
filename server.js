// Declaring dependancies
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// Creating express instance, port for server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to read notes. If an error is encountered, returns the callback function with an empty array
const readNotes = (callback) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return callback([])
        }
        try {
            const notes = JSON.parse(data);
            callback(notes);
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            callback([])
        }
    });
};

// API routes

// GET /api/notes to read db.json and return the saved notes as JSON
app.get('/api/notes', (req, res) => {
    readNotes((notes) => res.json(notes));
});

// POST /api/notes to receive a new note and add it to the db.json
app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuid() };

    readNotes((notes) => {
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to save note' });
            } else {
                res.json(newNote);
            }
        });
    });
});

// HTML routes

// GET /notes route to return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// GET * route to return the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port for server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost/${PORT}`);
});