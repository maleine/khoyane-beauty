const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM services WHERE actif = 1 LIMIT 8');
    const [temoignages] = await db.query('SELECT * FROM temoignages WHERE actif = 1 LIMIT 4');
    const [articles] = await db.query('SELECT * FROM articles WHERE publie = 1 ORDER BY created_at DESC LIMIT 3');
    const [produits] = await db.query('SELECT * FROM produits WHERE actif = 1 LIMIT 4');

    res.render('index', {
      title: 'NailArt Studio - Beauté & Élégance',
      services,
      temoignages,
      articles,
      produits
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      title: 'NailArt Studio - Beauté & Élégance',
      services: [],
      temoignages: [],
      articles: [],
      produits: []
    });
  }
});

router.get('/about', async (req, res) => {
  try {
    const [temoignages] = await db.query('SELECT * FROM temoignages WHERE actif = 1');
    res.render('about', { title: 'À Propos - NailArt Studio', temoignages });
  } catch (err) {
    res.render('about', { title: 'À Propos - NailArt Studio', temoignages: [] });
  }
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact - NailArt Studio', success: null, error: null });
});

router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    await db.query('INSERT IGNORE INTO newsletter (email) VALUES (?)', [email]);
    res.json({ success: true, message: 'Merci pour votre inscription!' });
  } catch (err) {
    res.json({ success: false, message: 'Erreur lors de l\'inscription.' });
  }
});

module.exports = router;
