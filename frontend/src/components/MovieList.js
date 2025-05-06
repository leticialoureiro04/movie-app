import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies(currentPage);
        setMovies(data.movies);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movies');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovies();
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="movie-list">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {movies.map(movie => (
          <div className="col" key={movie._id}>
            <div className="card h-100">
              {movie.poster ? (
                <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '300px', objectFit: 'cover' }} />
              ) : (
                <div className="card-img-top bg-dark text-white d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                  No Image
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.year}</p>
                <div className="d-flex flex-wrap">
                  {movie.genres && movie.genres.map((genre, index) => (
                    <span key={index} className="badge bg-secondary me-1 mb-1">{genre}</span>
                  ))}
                </div>
              </div>
              <div className="card-footer">
                <Link to={`/movies/${movie._id}`} className="btn btn-primary w-100">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button 
          className="btn btn-outline-primary" 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          className="btn btn-outline-primary" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MovieList;