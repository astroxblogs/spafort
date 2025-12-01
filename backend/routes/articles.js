import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Article from '../models/Article.js';

const router = express.Router();

// Get all published articles (public) - with category population
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1, createdAt: -1 });
    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get articles by category slug (public)
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // First find the category to get its ID
    const ArticleCategory = (await import('../models/ArticleCategory.js')).default;
    const category = await ArticleCategory.findOne({ slug: categorySlug, isActive: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const articles = await Article.find({ category: category._id, published: true })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      data: {
        category,
        articles,
      },
    });
  } catch (error) {
    console.error('Get articles by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get article by category and article slug (public)
router.get('/category/:categorySlug/:articleSlug', async (req, res) => {
  try {
    const { categorySlug, articleSlug } = req.params;

    // First find the category to get its ID
    const ArticleCategory = (await import('../models/ArticleCategory.js')).default;
    const category = await ArticleCategory.findOne({ slug: categorySlug, isActive: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const article = await Article.findOne({
      slug: articleSlug,
      category: category._id,
      published: true
    }).populate('category', 'name slug');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get article by slug (public) - fallback for old URLs
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true })
      .populate('category', 'name slug');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Create article (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const articleData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'category'];
    for (const field of requiredFields) {
      if (!articleData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // Generate slug from title if not provided
    if (!articleData.slug) {
      articleData.slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Check if slug already exists
    const existingArticle = await Article.findOne({ slug: articleData.slug });
    if (existingArticle) {
      return res.status(400).json({
        success: false,
        message: 'Article with this slug already exists',
      });
    }

    // Set publishedAt if publishing
    if (articleData.published && !articleData.publishedAt) {
      articleData.publishedAt = new Date();
    }

    const article = new Article(articleData);
    await article.save();

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Update article (admin only)
router.put('/:identifier', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { identifier } = req.params;
    const articleData = req.body;

    // Generate new slug if title changed
    let slug = identifier;
    if (articleData.title) {
      slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Find and update the article
    const existingArticle = await Article.findOne({ slug: identifier });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Set publishedAt if publishing for the first time
    if (articleData.published && !existingArticle.publishedAt) {
      articleData.publishedAt = new Date();
    }

    // Update the article
    const updatedArticle = await Article.findOneAndUpdate(
      { slug: identifier },
      { ...articleData, slug },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Delete article (admin only)
router.delete('/:identifier', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { identifier } = req.params;

    // Find and delete by slug
    const article = await Article.findOneAndDelete({ slug: identifier });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get all articles (admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get all articles admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;