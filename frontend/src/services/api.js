import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Movie related API calls
export const getMovies = async (page = 1, limit = 20) => {
  const response = await api.get(`/movies?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMovie = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

// Comment related API calls
export const addComment = async (movieId, comment) => {
  const response = await api.post(`/movies/${movieId}/comments`, comment);
  return response.data;
};

export const updateComment = async (movieId, commentId, updatedComment) => {
  const response = await api.put(`/movies/${movieId}/comments/${commentId}`, updatedComment);
  return response.data;
};

export const deleteComment = async (movieId, commentId) => {
  const response = await api.delete(`/movies/${movieId}/comments/${commentId}`);
  return response.data;
};