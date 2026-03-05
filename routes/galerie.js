const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [galerie] = await db.query('SELECT * FROM galerie ORDER BY created_at DESC');
    const images = galerie.length > 0 ? galerie : [
      { id:1,  titre:'Design Naturel',       image:'nail-01.jpg', categorie:'Manicure' },
      { id:2,  titre:'Pose Américaine',      image:'nail-02.jpg', categorie:'Manicure' },
      { id:3,  titre:'Gel Brillant',         image:'nail-03.jpg', categorie:'Gel' },
      { id:4,  titre:'French Classique',     image:'nail-04.jpg', categorie:'Manicure' },
      { id:5,  titre:'Nail Art Floral',      image:'nail-05.jpg', categorie:'Art' },
      { id:6,  titre:'Ombré Pastel',         image:'nail-06.jpg', categorie:'Gel' },
      { id:7,  titre:'Strass & Gems',        image:'nail-07.jpg', categorie:'Art' },
      { id:8,  titre:'Nude Chic',            image:'nail-08.jpg', categorie:'Manicure' },
      { id:9,  titre:'Design Géométrique',   image:'nail-09.jpg', categorie:'Art' },
      { id:10, titre:'Collection Bio',       image:'nail-10.jpg', categorie:'Soins' },
      { id:11, titre:'Stamping Professionnel',image:'nail-11.jpg', categorie:'Art' },
      { id:12, titre:'Vernis Semi-Perm',     image:'nail-12.jpg', categorie:'Gel' },
      { id:13, titre:'Extension Résine',     image:'nail-13.jpg', categorie:'Manicure' },
      { id:14, titre:'Gainage Crystal',      image:'nail-14.jpg', categorie:'Gel' },
      { id:15, titre:'Pop-It Design',        image:'nail-15.jpg', categorie:'Art' },
      { id:16, titre:'Chabblon Luxe',        image:'nail-16.jpg', categorie:'Art' },
      { id:17, titre:'Jelly Spa',            image:'nail-17.jpg', categorie:'Soins' },
      { id:18, titre:'Pédicure Complète',    image:'nail-18.jpg', categorie:'Soins' },
      { id:19, titre:'Design Butterfly',     image:'nail-19.jpg', categorie:'Art' },
      { id:20, titre:'Marble Effect',        image:'nail-20.jpg', categorie:'Gel' },
    ];
    res.render('galerie', { title: 'Galerie - Khoyane Beauty', images });
  } catch (err) {
    console.error(err);
    res.render('galerie', { title: 'Galerie', images: [] });
  }
});

module.exports = router;
