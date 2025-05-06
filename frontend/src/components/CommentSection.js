import React, { useState } from 'react';
import { addComment, updateComment, deleteComment } from '../services/api';

function CommentSection({ movieId, comments = [], setMovie }) {
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });
  const [editingComment, setEditingComment] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingComment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editing && editingComment) {
        // Update existing comment
        await updateComment(movieId, editingComment._id, editingComment);
        
        // Update local state
        setMovie(prev => ({
          ...prev,
          comments: prev.comments.map(c => 
            c._id === editingComment._id ? editingComment : c
          )
        }));
        
        // Reset edit mode
        setEditing(false);
        setEditingComment(null);
      } else {
        // Add new comment
        const addedComment = await addComment(movieId, newComment);
        
        // Update local state
        setMovie(prev => ({
          ...prev,
          comments: [...prev.comments, addedComment]
        }));
        
        // Reset form
        setNewComment({ name: '', email: '', text: '' });
      }
    } catch (err) {
      setError('Failed to save comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditing(true);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteComment(movieId, commentId);
      
      // Update local state
      setMovie(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditingComment(null);
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editing ? 'Edit Comment' : 'Add Comment'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={editing ? editingComment.name : newComment.name}
                onChange={editing ? handleEditInputChange : handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editing ? editingComment.email : newComment.email}
                onChange={editing ? handleEditInputChange : handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="text" className="form-label">Comment</label>
              <textarea
                className="form-control"
                id="text"
                name="text"
                rows="3"
                value={editing ? editingComment.text : newComment.text}
                onChange={editing ? handleEditInputChange : handleInputChange}
                required
              />
            </div>
            <div className="d-flex">
              <button 
                type="submit" 
                className="btn btn-primary me-2" 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : editing ? 'Update Comment' : 'Add Comment'}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comment-list">
          {comments.map(comment => (
            <div className="card mb-3" key={comment._id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-subtitle mb-0 text-primary">{comment.name}</h6>
                  <small className="text-muted">
                    {new Date(comment.date).toLocaleDateString()} {new Date(comment.date).toLocaleTimeString()}
                  </small>
                </div>
                <p className="card-text">{comment.text}</p>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => handleEdit(comment)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;