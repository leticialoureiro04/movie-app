const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Movie Schema - Simplified to match the mflix collection structure
const movieSchema = new mongoose.Schema({
  // Basic movie fields
  title: String,
  year: Number,
  runtime: Number,
  poster: String,
  plot: String,
  fullplot: String,
  rated: String,
  released: Date,
  genres: [String],
  directors: [String],
  cast: [String],
  countries: [String],
  type: String,
  
  // Comments will be a subdocument
  comments: [commentSchema]
});

// Create models
const Movie = mongoose.model('Movie', movieSchema, 'movies');

module.exports = Movie;