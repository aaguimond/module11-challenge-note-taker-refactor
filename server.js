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
    // Reading our db.json file
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        // If error, log the error and return an empty array
        if (err) {
            console.error(err);
            return callback([])
        }
        // Try to parse the JSON data, but if not,
        try {
            const notes = JSON.parse(data);
            callback(notes);
        // then catch the error, log it, and return an empty array
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            callback([])
        }
    });
};

// API routes

// GET /api/notes to read db.json and return the saved notes as JSON
app.get('/api/notes', (req, res) => {
    // Calling our read notes function and displaying it as JSON
    readNotes((notes) => res.json(notes));
});

// POST /api/notes to receive a new note and add it to the db.json
app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuid() };
    // Calling our readNotes function and pushing our new note to the notes object
    readNotes((notes) => {
        notes.push(newNote);
        // Writing our notes to our db.json file with nice formatting
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

// DELETE function based on the selected note's ID
app.delete('/api/notes/:id', (req, res) => {
    // Get ID from note being deleted
    const noteId = req.params.id;
    // Calling our readNotes function
    readNotes((notes) => {
        // Keeping all notes that DON'T match the ID of the note we've chosen to delete
        const updatedNotes = notes.filter(note => note.id !== noteId);
        // Writing our updated notes to our db.json file
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes, null, 2), (err) => {
            // Displaying our error message if we encounter an error
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to delete note' });
            } else {
                // Else we display 'Note deleted'
                res.json({ message: 'Note deleted', id: noteId })
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