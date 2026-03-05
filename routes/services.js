const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [manicure] = await db.query("SELECT * FROM services WHERE categorie='manicure' AND actif=1");
    const [pedicure] = await db.query("SELECT * FROM services WHERE categorie='pedicure' AND actif=1");
    const [nailcare] = await db.query("SELECT * FROM services WHERE categorie='nail_care' AND actif=1");
    const [cosmetics] = await db.query("SELECT * FROM services WHERE categorie='cosmetics' AND actif=1");
    res.render('services', { title: 'Nos Services - NailArt Studio', manicure, pedicure, nailcare, cosmetics });
  } catch (err) {
    console.error(err);
    res.render('services', { title: 'Nos Services', manicure: [], pedicure: [], nailcare: [], cosmetics: [] });
  }
});

module.exports = router;
