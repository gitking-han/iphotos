import React, { useState, useContext } from 'react';
import photoContext from '../context/PhotoContext';
import '../App.css';

const Upload = () => {
  const { uploadPhoto } = useContext(photoContext); // Use uploadPhoto from context
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [contentType, setContentType] = useState('');
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      const base64String = result.split(',')[1];
      const extractedContentType = result.split(';')[0].split(':')[1];
      setImageBase64(base64String);
      setContentType(extractedContentType);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageBase64 || !contentType) {
      return alert("Please select an image.");
    }

    try {
      await uploadPhoto(title, description, imageBase64, contentType);
      alert("Photo uploaded successfully!");
      setTitle('');
      setDescription('');
      setImageBase64('');
      setContentType('')
    } catch (error) {
      alert('Upload failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="uploadphoto container my-5">
      <h2 className="mb-4">Upload a Photo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input 
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Select Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
            required
          />
        </div>
        {imageBase64 && (
          <div className="mb-3">
            <img
              src={`data:${contentType};base64,${imageBase64}`}
              alt="Preview"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
