import React, { useEffect, useContext, useState } from 'react';
import photoContext from '../context/PhotoContext';

const Gallery = () => {
  const {
    photos,
    fetchPhotos,
    searchQuery = '',
    setSearchQuery = () => {},
    deletePhoto,
    updatePhoto
  } = useContext(photoContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editPhoto, setEditPhoto] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageBase64, setEditImageBase64] = useState(null);
  const [editContentType, setEditContentType] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []); // eslint-disable-line

  const handleImageClick = (imageBase64) => {
    setSelectedImage(imageBase64);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const handleEditClick = (photo) => {
    setEditPhoto(photo);
    setEditTitle(photo.title);
    setEditDescription(photo.description || '');
    setEditImageBase64(null); // keep original unless changed
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditContentType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]; // remove data prefix
        setEditImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateClick = async () => {
    const updatedData = {
      title: editTitle,
      description: editDescription,
    };

    if (editImageBase64 && editContentType) {
      updatedData.imageBase64 = editImageBase64;
      updatedData.contentType = editContentType;
    }

    const result = await updatePhoto(editPhoto._id, updatedData);
    if (result?.success !== false) {
      setShowEditModal(false);
      setEditPhoto(null);
      setEditImageBase64(null);
      setEditContentType('');
      fetchPhotos(); // refresh to show updated image
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    const title = photo.title || '';
    const description = photo.description || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container-fluid py-5">
      <h2 className="mb-4">📸 My Photo Gallery</h2>

      {filteredPhotos.length === 0 ? (
        <p className="text-muted">No photos uploaded yet.</p>
      ) : (
        <div className="row">
          {filteredPhotos.map((photo) => (
            <div key={photo._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={photo.imageBase64}
                  alt={photo.title}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
                  onClick={() => handleImageClick(photo.imageBase64)}
                />
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title">{photo.title}</h5>
                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                      {photo.description}
                    </p>
                  </div>
                  <div>
                    <i
                      className="fas fa-trash-alt text-danger ms-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => deletePhoto(photo._id)}
                    ></i>
                    <i
                      className="fas fa-pen text-primary ms-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(photo)}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal show fade d-block" tabIndex="-1" onClick={handleCloseImageModal} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Photo Preview</h5>
                <button type="button" className="btn-close" onClick={handleCloseImageModal}></button>
              </div>
              <div className="modal-body text-center">
                <img src={selectedImage} alt="Full Preview" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Photo</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={handleUpdateClick}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
