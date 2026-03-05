const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [produits] = await db.query('SELECT * FROM produits WHERE actif = 1 ORDER BY categorie, nom');
    res.render('produits', { title: 'Produits - Khoyane Beauty', produits });
  } catch (err) {
    res.render('produits', { title: 'Produits', produits: [] });
  }
});

module.exports = router;
