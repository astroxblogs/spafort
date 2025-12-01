import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArticleCategory',
    required: true,
  },
  author: {
    type: String,
  },
  featuredImage: {
    type: String, // Cloudinary URL
  },
  contentImages: [{
    url: { type: String, required: true }, // Cloudinary URL
    alt: { type: String },
    caption: { type: String },
  }],
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  tags: [{
    type: String,
  }],
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
  readTime: {
    type: Number, // in minutes
  },
}, {
  timestamps: true,
});

// Pre-save middleware to generate slug from title
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for published date
articleSchema.virtual('publishedDate').get(function() {
  return this.publishedAt || this.createdAt;
});

export default mongoose.models.Article || mongoose.model('Article', articleSchema);