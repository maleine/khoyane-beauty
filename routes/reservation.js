const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { notifierNouvelleReservation } = require('../services/notifications');

router.get('/', async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM services WHERE actif = 1 ORDER BY categorie, nom');
    const selectedServiceId = req.query.service ? parseInt(req.query.service) : null;
    res.render('reservation', { title: 'Réserver - Khoyane Beauty', services, success: null, error: null, reservation: null, selectedServiceId });
  } catch (err) {
    res.render('reservation', { title: 'Réserver', services: [], success: null, error: null, reservation: null, selectedServiceId: null });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, service_id, date_rdv, heure_rdv, message } = req.body;
    if (!nom || !prenom || !email || !telephone || !date_rdv || !heure_rdv) {
      const [services] = await db.query('SELECT * FROM services WHERE actif = 1');
      return res.render('reservation', { title: 'Réserver', services, success: null, error: 'Veuillez remplir tous les champs obligatoires.', reservation: null, selectedServiceId: null });
    }

    const [result] = await db.query(
      'INSERT INTO reservations (nom, prenom, email, telephone, service_id, date_rdv, heure_rdv, message) VALUES (?,?,?,?,?,?,?,?)',
      [nom, prenom, email, telephone, service_id || null, date_rdv, heure_rdv, message || null]
    );

    let serviceNom = 'Non spécifié';
    if (service_id) {
      const [svcs] = await db.query('SELECT nom FROM services WHERE id = ?', [service_id]);
      if (svcs.length > 0) serviceNom = svcs[0].nom;
    }

    const reservationData = {
      id: result.insertId,
      nom, prenom, email, telephone,
      service_nom: serviceNom,
      date_rdv,
      heure_rdv,
      message
    };

    // Déclencher les notifications (non bloquant)
    notifierNouvelleReservation(reservationData).catch(err =>
      console.error('[NOTIF] Erreur:', err.message)
    );

    const [services] = await db.query('SELECT * FROM services WHERE actif = 1');
    res.render('reservation', {
      title: 'Réservation confirmée',
      services,
      success: 'confirmed',
      error: null,
      selectedServiceId: null,
      reservation: {
        ...reservationData,
        date_rdv: new Date(date_rdv).toLocaleDateString('fr-FR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }),
      }
    });
  } catch (err) {
    console.error(err);
    const [services] = await db.query('SELECT * FROM services WHERE actif = 1').catch(() => [[]]);
    res.render('reservation', { title: 'Réserver', services, success: null, error: 'Erreur lors de la réservation. Veuillez réessayer.', reservation: null, selectedServiceId: null });
  }
});

module.exports = router;
