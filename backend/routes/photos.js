const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const fetchUser = require('../middleware/fetchuser'); // JWT middleware
const { body, validationResult } = require('express-validator');

// @route    POST /api/photos
// @desc     Upload photo (Base64) 
// @access   Private
router.post(
  '/',
  fetchUser,
  [
    body('title', 'Title is required').notEmpty(),
    body('imageBase64', 'Base64 image is required').notEmpty(),
    body('contentType', 'Content type is required').notEmpty()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, imageBase64, contentType } = req.body;

      const newPhoto = new Photo({
        title,
        image: {
          data: Buffer.from(imageBase64, 'base64'),
          contentType,
        },
        uploadedBy: req.user.id,
      });

      const savedPhoto = await newPhoto.save();
      res.status(201).json(savedPhoto);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// @route    GET /api/photos
// @desc     Fetch all photos uploaded by logged-in user
// @access   Private
router.get('/', fetchUser, async (req, res) => {
  try {
    const photos = await Photo.find({ uploadedBy: req.user.id }).sort({ uploadedAt: -1 });

    const formattedPhotos = photos.map(photo => ({
      _id: photo._id,
      title: photo.title,
      uploadedAt: photo.uploadedAt,
      imageBase64: `data:${photo.image.contentType};base64,${photo.image.data.toString('base64')}`
    }));

    res.json(formattedPhotos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});


// @route    DELETE /api/photos/:id
// @desc     Delete a photo by ID (only if uploaded by the current user)
// @access   Private
router.delete('/:id', fetchUser, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check if the logged-in user is the owner
    if (photo.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error while deleting photo' });
  }
});

// @route    PUT /api/photos/:id
// @desc     Update photo title or image
// @access   Private
router.put('/:id', fetchUser, async (req, res) => {
  try {
    const { title, description, imageBase64, contentType } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (imageBase64 && contentType) {
      updates.image = {
        data: Buffer.from(imageBase64, 'base64'),
        contentType: contentType,
      };
    }

    let photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).send("Photo not found");
    if (photo.uploadedBy.toString() !== req.user.id) return res.status(401).send("Unauthorized");

    const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });

    res.json({
      _id: updatedPhoto._id,
      title: updatedPhoto.title,
      description: updatedPhoto.description,
      uploadedAt: updatedPhoto.uploadedAt,
      imageBase64: `data:${updatedPhoto.image.contentType};base64,${updatedPhoto.image.data.toString('base64')}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
