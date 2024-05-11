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

// HTML routes

// GET /notes route to return the notes.html file


// GET * route to return the index.html file


// API routes

// GET /api/notes to read db.json and return the saved notes as JSON


// POST /api/notes to receive a new note and add it to the db.json
