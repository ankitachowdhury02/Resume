const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  gpa: {
    type: String
  },
  description: {
    type: String,
    trim: true
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  achievements: [{
    type: String,
    trim: true
  }]
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'],
    default: 'Technical'
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  url: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  }
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    summary: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
      trim: true
    }
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    url: {
      type: String,
      trim: true
    }
  }],
  languages: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Professional', 'Native'],
      default: 'Professional'
    }
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  publicSlug: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one default resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Generate public slug when making resume public
resumeSchema.pre('save', async function(next) {
  if (this.isPublic && !this.publicSlug) {
    const baseSlug = `${this.personalInfo.firstName}-${this.personalInfo.lastName}`.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.constructor.findOne({ publicSlug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.publicSlug = slug;
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
