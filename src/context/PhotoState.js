import React, { useState } from "react";
import photoContext from "./PhotoContext";

const PhotoState = (props) => {
    const host = "https://backend-iphotos-production.up.railway.app";
    const [photos, setPhotos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all photos
    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${host}/api/photos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                }
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setPhotos(data);
            } else {
                console.error("Fetch error:", data);
            }
        } catch (err) {
            console.error("Network error:", err.message);
        }
    };

    // Upload a photo (Base64)
    const uploadPhoto = async (title, description, imageBase64, contentType) => {
        try {
            const response = await fetch(`${host}/api/photos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, imageBase64, contentType })
            });

            const newPhoto = await response.json();
            if (response.ok) {
                setPhotos(prev => [newPhoto, ...prev]);
            } else {
                console.error("Upload failed:", newPhoto);
            }
        } catch (err) {
            console.error("Upload error:", err.message);
        }
    };

    // Delete a photo
    const deletePhoto = async (id) => {
        try {
            const response = await fetch(`${host}/api/photos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                }
            });

            if (response.ok) {
                setPhotos(prev => prev.filter(photo => photo._id !== id));
            } else {
                const error = await response.json();
                console.error("Delete failed:", error);
            }
        } catch (err) {
            console.error("Delete error:", err.message);
        }
    };
   // Update photo
const updatePhoto = async (id, { title, description, imageBase64, contentType }) => {
  try {
    const response = await fetch(`${host}/api/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, imageBase64, contentType })
    });

    const updated = await response.json();
    if (response.ok) {
      // Replace updated photo in state
      setPhotos(prev => prev.map(p => p._id === id ? updated : p));
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error("Update failed", err);
    return { success: false };
  }
};


    return (
        <photoContext.Provider value={{
            photos,
            fetchPhotos,
            uploadPhoto,
            deletePhoto,
            searchQuery,
            setSearchQuery,
            updatePhoto
        }}>
            {props.children}
        </photoContext.Provider>
    );
};

export default PhotoState;
