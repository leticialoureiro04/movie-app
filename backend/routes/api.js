const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET all movies (paginated)
router.get('/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({})
      .select('title year poster genres')
      .skip(skip)
      .limit(limit);

    const totalMovies = await Movie.countDocuments();

    res.json({
      movies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single movie by ID
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST add a comment to a movie
router.post('/movies/:id/comments', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const { name, email, text } = req.body;
    if (!name || !email || !text) {
      return res.status(400).json({ message: 'Please provide name, email and text for the comment' });
    }

    const newComment = {
      name,
      email,
      text,
      date: new Date()
    };

    movie.comments.push(newComment);
    await movie.save();

    res.status(201).json(movie.comments[movie.comments.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update a comment
router.put('/movies/:movieId/comments/:commentId', async (req, res) => {
  try {
    const { name, email, text } = req.body;
    if (!name && !email && !text) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const comment = movie.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update comment fields if provided
    if (name) comment.name = name;
    if (email) comment.email = email;
    if (text) comment.text = text;

    await movie.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE a comment
router.delete('/movies/:movieId/comments/:commentId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const comment = movie.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.remove();
    await movie.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;