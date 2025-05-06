import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie } from '../services/api';
import CommentSection from './CommentSection';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovie(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!movie) {
    return <div className="alert alert-warning">Movie not found</div>;
  }

  return (
    <div className="movie-details">
      <Link to="/" className="btn btn-outline-primary mb-4">
        &larr; Back to Movies
      </Link>

      <div className="row">
        <div className="col-md-4 mb-4">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="img-fluid rounded shadow" />
          ) : (
            <div className="bg-dark text-white d-flex align-items-center justify-content-center rounded" style={{ height: '450px' }}>
              No Image Available
            </div>
          )}
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">{movie.title} {movie.year && `(${movie.year})`}</h1>
          
          {movie.rated && (
            <span className="badge bg-dark me-2">{movie.rated}</span>
          )}
          
          {movie.runtime && (
            <span className="badge bg-secondary me-2">{movie.runtime} min</span>
          )}
          
          {movie.released && (
            <span className="text-muted">Released: {new Date(movie.released).toLocaleDateString()}</span>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <div className="my-3">
              {movie.genres.map((genre, index) => (
                <span key={index} className="badge bg-info me-1">{genre}</span>
              ))}
            </div>
          )}

          {movie.directors && movie.directors.length > 0 && (
            <p><strong>Directors:</strong> {movie.directors.join(', ')}</p>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          )}

          {movie.countries && movie.countries.length > 0 && (
            <p><strong>Countries:</strong> {movie.countries.join(', ')}</p>
          )}

          {movie.fullplot ? (
            <div className="mt-3">
              <h5>Plot</h5>
              <p>{movie.fullplot}</p>
            </div>
          ) : movie.plot ? (
            <div className="mt-3">
              <h5>Plot</h5>
              <p>{movie.plot}</p>
            </div>
          ) : null}
        </div>
      </div>

      <hr className="my-4" />
      
      <CommentSection movieId={id} comments={movie.comments || []} setMovie={setMovie} />
    </div>
  );
}

export default MovieDetails;