const express = require('express');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');

const router = express.Router();

// @route   GET /api/resume
// @desc    Get all resumes for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-userId');

    res.json({
      resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error fetching resumes' });
  }
});

// @route   GET /api/resume/:id
// @desc    Get single resume by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error fetching resume' });
  }
});

// @route   POST /api/resume
// @desc    Create new resume
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('personalInfo.firstName').trim().notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const resumeData = {
      ...req.body,
      userId: req.user._id
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      message: 'Resume created successfully',
      resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Server error creating resume' });
  }
});

// @route   PUT /api/resume/:id
// @desc    Update resume
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('personalInfo.firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('personalInfo.lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('personalInfo.email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Update resume
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        resume[key] = req.body[key];
      }
    });

    await resume.save();

    res.json({
      message: 'Resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error updating resume' });
  }
});

// @route   DELETE /api/resume/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error deleting resume' });
  }
});

// @route   PUT /api/resume/:id/set-default
// @desc    Set resume as default
// @access  Private
router.put('/:id/set-default', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Set all other resumes to not default
    await Resume.updateMany(
      { userId: req.user._id },
      { $set: { isDefault: false } }
    );

    // Set this resume as default
    resume.isDefault = true;
    await resume.save();

    res.json({
      message: 'Default resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Set default resume error:', error);
    res.status(500).json({ message: 'Server error setting default resume' });
  }
});

// @route   POST /api/resume/:id/duplicate
// @desc    Duplicate resume
// @access  Private
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalResume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!originalResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Create duplicate
    const duplicateData = originalResume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.publicSlug;
    duplicateData.title = `${originalResume.title} (Copy)`;
    duplicateData.isDefault = false;
    duplicateData.isPublic = false;

    const duplicateResume = new Resume(duplicateData);
    await duplicateResume.save();

    res.status(201).json({
      message: 'Resume duplicated successfully',
      resume: duplicateResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({ message: 'Server error duplicating resume' });
  }
});

// @route   PUT /api/resume/:id/toggle-public
// @desc    Toggle resume public visibility
// @access  Private
router.put('/:id/toggle-public', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.isPublic = !resume.isPublic;
    
    // If making private, remove public slug
    if (!resume.isPublic) {
      resume.publicSlug = undefined;
    }
    
    await resume.save();

    res.json({
      message: `Resume ${resume.isPublic ? 'made public' : 'made private'} successfully`,
      resume
    });
  } catch (error) {
    console.error('Toggle public resume error:', error);
    res.status(500).json({ message: 'Server error toggling resume visibility' });
  }
});

// @route   GET /api/public/resume/:slug
// @desc    Get public resume by slug
// @access  Public
router.get('/public/:slug', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      publicSlug: req.params.slug,
      isPublic: true
    }).select('-userId');

    if (!resume) {
      return res.status(404).json({ message: 'Public resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get public resume error:', error);
    res.status(500).json({ message: 'Server error fetching public resume' });
  }
});

module.exports = router;
