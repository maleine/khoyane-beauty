const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [articles] = await db.query('SELECT * FROM articles WHERE publie = 1 ORDER BY created_at DESC');
    res.render('blog', { title: 'Blog - NailArt Studio', articles });
  } catch (err) {
    res.render('blog', { title: 'Blog', articles: [] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [articles] = await db.query('SELECT * FROM articles WHERE id = ? AND publie = 1', [req.params.id]);
    if (articles.length === 0) return res.redirect('/blog');
    await db.query('UPDATE articles SET vues = vues + 1 WHERE id = ?', [req.params.id]);
    const [recents] = await db.query('SELECT * FROM articles WHERE publie = 1 AND id != ? ORDER BY created_at DESC LIMIT 3', [req.params.id]);
    res.render('blog-detail', { title: articles[0].titre + ' - Blog', article: articles[0], recents });
  } catch (err) {
    res.redirect('/blog');
  }
});

module.exports = router;
