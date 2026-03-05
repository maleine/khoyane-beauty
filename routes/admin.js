const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'upload-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
  }
});
const fileFilter = (req, file, cb) => {
  ['.jpg','.jpeg','.png','.webp','.gif'].includes(path.extname(file.originalname).toLowerCase())
    ? cb(null, true) : cb(new Error('Image requise'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
}

// LOGIN
router.get('/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('admin/login', { title: 'Connexion Admin', error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const envEmail = process.env.ADMIN_EMAIL || 'admin@khoyanebeauty.com';
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (email === envEmail && password === envPassword) {
    req.session.admin = { id: 1, nom: 'Khoyane Admin', email };
    return res.redirect('/admin');
  }
  try {
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length > 0 && await bcrypt.compare(password, admins[0].password)) {
      req.session.admin = { id: admins[0].id, nom: admins[0].nom, email: admins[0].email };
      return res.redirect('/admin');
    }
  } catch (e) { console.warn('DB login:', e.message); }
  res.render('admin/login', { title: 'Connexion Admin', error: 'Email ou mot de passe incorrect.' });
});

router.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/admin/login'); });

// DASHBOARD
router.get('/', requireAuth, async (req, res) => {
  try {
    const [[{ total_reservations }]] = await db.query('SELECT COUNT(*) as total_reservations FROM reservations');
    const [[{ reservations_attente }]] = await db.query("SELECT COUNT(*) as reservations_attente FROM reservations WHERE statut='en_attente'");
    const [[{ total_services }]] = await db.query('SELECT COUNT(*) as total_services FROM services WHERE actif=1');
    const [[{ total_articles }]] = await db.query('SELECT COUNT(*) as total_articles FROM articles');
    const [[{ total_newsletter }]] = await db.query('SELECT COUNT(*) as total_newsletter FROM newsletter');
    const [dernieres_reservations] = await db.query('SELECT r.*, s.nom as service_nom FROM reservations r LEFT JOIN services s ON r.service_id = s.id ORDER BY r.created_at DESC LIMIT 10');
    // Dernières commandes avec leurs items
    const [dernieres_commandes] = await db.query(`
      SELECT c.*, 
        GROUP_CONCAT(CONCAT(ci.nom_produit, ' (x', ci.quantite, ')') SEPARATOR ' · ') as detail_items,
        GROUP_CONCAT(ci.quantite) as quantites,
        COUNT(ci.id) as nb_articles
      FROM commandes c
      LEFT JOIN commande_items ci ON ci.commande_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC LIMIT 8
    `).catch(() => [[]]);
    res.render('admin/dashboard', { title: 'Dashboard', admin: req.session.admin, stats: { total_reservations, reservations_attente, total_services, total_articles, total_newsletter }, dernieres_reservations, dernieres_commandes: dernieres_commandes || [] });
  } catch (err) {
    res.render('admin/dashboard', { title: 'Dashboard', admin: req.session.admin, stats: { total_reservations:0, reservations_attente:0, total_services:0, total_articles:0, total_newsletter:0 }, dernieres_reservations: [], dernieres_commandes: [] });
  }
});

// RÉSERVATIONS
router.get('/reservations', requireAuth, async (req, res) => {
  try {
    const { statut, date, search } = req.query;
    let query = 'SELECT r.*, s.nom as service_nom FROM reservations r LEFT JOIN services s ON r.service_id = s.id WHERE 1=1';
    const params = [];
    if (statut && statut !== 'tous') { query += ' AND r.statut = ?'; params.push(statut); }
    if (date) { query += ' AND r.date_rdv = ?'; params.push(date); }
    if (search) { query += ' AND (r.nom LIKE ? OR r.prenom LIKE ? OR r.email LIKE ? OR r.telephone LIKE ?)'; const s = '%'+search+'%'; params.push(s,s,s,s); }
    query += ' ORDER BY r.created_at DESC';
    const [reservations] = await db.query(query, params);
    const [[{total}]] = await db.query('SELECT COUNT(*) as total FROM reservations');
    const [[{attente}]] = await db.query("SELECT COUNT(*) as attente FROM reservations WHERE statut='en_attente'");
    const [[{confirme}]] = await db.query("SELECT COUNT(*) as confirme FROM reservations WHERE statut='confirme'");
    const [[{annule}]] = await db.query("SELECT COUNT(*) as annule FROM reservations WHERE statut='annule'");
    res.render('admin/reservations', { title: 'Réservations', admin: req.session.admin, reservations, stats: {total,attente,confirme,annule}, filters: {statut: statut||'tous', date: date||'', search: search||''} });
  } catch (err) {
    res.render('admin/reservations', { title: 'Réservations', admin: req.session.admin, reservations: [], stats: {total:0,attente:0,confirme:0,annule:0}, filters: {statut:'tous',date:'',search:''} });
  }
});

router.post('/reservations/:id/statut', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE reservations SET statut = ? WHERE id = ?', [req.body.statut, req.params.id]);
    // Log notification pour le suivi
    if (req.body.statut === 'confirme') {
      try {
        const [rows] = await db.query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
          const r = rows[0];
          console.log('✅ RÉSERVATION CONFIRMÉE:', r.prenom, r.nom, '|', r.telephone, '|', r.date_rdv, r.heure_rdv);
        }
      } catch(_) {}
    }
  } catch (_) {}
  res.redirect('/admin/reservations');
});
router.post('/reservations/:id/delete', requireAuth, async (req, res) => {
  try { await db.query('DELETE FROM reservations WHERE id = ?', [req.params.id]); } catch (_) {}
  res.redirect('/admin/reservations');
});
router.get('/api/reservations/nouvelles', requireAuth, async (req, res) => {
  try {
    const since = req.query.since || new Date(Date.now() - 30000).toISOString();
    const [nouvelles] = await db.query("SELECT r.id, r.nom, r.prenom, r.telephone, r.date_rdv, r.heure_rdv, s.nom as service_nom, r.created_at FROM reservations r LEFT JOIN services s ON r.service_id = s.id WHERE r.created_at > ? AND r.statut = 'en_attente' ORDER BY r.created_at DESC", [since]);
    const [[{count}]] = await db.query("SELECT COUNT(*) as count FROM reservations WHERE statut='en_attente'");
    res.json({ nouvelles, total_attente: count });
  } catch (err) { res.json({ nouvelles: [], total_attente: 0 }); }
});
router.post('/api/reservations/:id/statut', requireAuth, async (req, res) => {
  try { await db.query('UPDATE reservations SET statut = ? WHERE id = ?', [req.body.statut, req.params.id]); res.json({success:true}); }
  catch (err) { res.json({success:false}); }
});

// SERVICES
router.get('/services', requireAuth, async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM services ORDER BY categorie, nom');
    res.render('admin/services', { title: 'Services', admin: req.session.admin, services, success: req.query.success||null, error: null });
  } catch (err) {
    res.render('admin/services', { title: 'Services', admin: req.session.admin, services: [], success: null, error: null });
  }
});
// REMISES — services
router.post('/services/:id/remise', requireAuth, async (req, res) => {
  const { remise_type, remise_valeur, remise_label } = req.body;
  try {
    await db.query('UPDATE services SET remise_type=?, remise_valeur=?, remise_label=? WHERE id=?',
      [remise_type||'none', parseFloat(remise_valeur)||0, remise_label||null, req.params.id]);
    res.redirect('/admin/services?success=Remise appliquée avec succès !');
  } catch(e) { res.redirect('/admin/services?error=Erreur remise'); }
});

router.post('/services/:id/remise/supprimer', requireAuth, async (req, res) => {
  try {
    await db.query("UPDATE services SET remise_type='none', remise_valeur=0, remise_label=NULL WHERE id=?", [req.params.id]);
    res.redirect('/admin/services?success=Remise supprimée !');
  } catch(e) { res.redirect('/admin/services'); }
});

// CODES PROMO
router.get('/promos', requireAuth, async (req, res) => {
  try {
    const [promos] = await db.query('SELECT * FROM codes_promo ORDER BY created_at DESC').catch(()=>[[]]); 
    res.render('admin/promos', { title: 'Codes Promo', admin: req.session.admin, promos, success: req.query.success||null, error: null });
  } catch(e) {
    res.render('admin/promos', { title: 'Codes Promo', admin: req.session.admin, promos: [], success: null, error: null });
  }
});
router.post('/promos', requireAuth, async (req, res) => {
  const { code, type_remise, valeur, description, max_utilisations, date_expiration } = req.body;
  try {
    await db.query('INSERT INTO codes_promo (code, type_remise, valeur, description, max_utilisations, date_expiration) VALUES (?,?,?,?,?,?)',
      [code.toUpperCase(), type_remise, parseFloat(valeur), description||null, max_utilisations||null, date_expiration||null]);
    res.redirect('/admin/promos?success=Code promo créé !');
  } catch(e) { res.redirect('/admin/promos?error=Code déjà existant ou erreur'); }
});
router.post('/promos/:id/toggle', requireAuth, async (req, res) => {
  try { await db.query('UPDATE codes_promo SET actif = 1-actif WHERE id=?', [req.params.id]); } catch(_){}
  res.redirect('/admin/promos');
});
router.post('/promos/:id/delete', requireAuth, async (req, res) => {
  try { await db.query('DELETE FROM codes_promo WHERE id=?', [req.params.id]); } catch(_){}
  res.redirect('/admin/promos');
});

router.post('/services', requireAuth, upload.single('image_upload'), async (req, res) => {
  try {
    const { nom, description, prix, categorie, image, duree } = req.body;
    let img = req.file ? req.file.filename : (image && image.trim() ? image.trim() : 'nail-01.jpg');
    await db.query('INSERT INTO services (nom, description, prix, categorie, image, duree) VALUES (?,?,?,?,?,?)', [nom, description, prix, categorie, img, duree||60]);
    res.redirect('/admin/services?success=Service ajouté avec succès !');
  } catch (err) {
    const [services] = await db.query('SELECT * FROM services ORDER BY categorie, nom').catch(()=>[[]]);
    res.render('admin/services', { title: 'Services', admin: req.session.admin, services, success: null, error: "Erreur lors de l'ajout." });
  }
});
router.post('/services/dedup', requireAuth, async (req, res) => {
  try { await db.query('DELETE s1 FROM services s1 INNER JOIN services s2 WHERE s1.id > s2.id AND s1.nom = s2.nom AND s1.categorie = s2.categorie'); } catch(_) {}
  res.redirect('/admin/services?success=Doublons supprimés !');
});
router.post('/services/:id/delete', requireAuth, async (req, res) => {
  try { await db.query('DELETE FROM services WHERE id = ?', [req.params.id]); } catch (_) {}
  res.redirect('/admin/services');
});

// PRODUITS
router.get('/produits', requireAuth, async (req, res) => {
  try {
    const [produits] = await db.query('SELECT * FROM produits ORDER BY categorie, nom');
    res.render('admin/produits', { title: 'Produits', admin: req.session.admin, produits, success: req.query.success||null, error: null });
  } catch (err) {
    res.render('admin/produits', { title: 'Produits', admin: req.session.admin, produits: [], success: null, error: null });
  }
});
router.post('/produits', requireAuth, upload.single('image_upload'), async (req, res) => {
  try {
    const { nom, description, prix, categorie, image, stock } = req.body;
    let img = req.file ? req.file.filename : (image && image.trim() ? image.trim() : 'nail-01.jpg');
    await db.query('INSERT INTO produits (nom, description, prix, image, categorie, stock) VALUES (?,?,?,?,?,?)', [nom, description||'', prix, img, categorie||'beaute', stock||0]);
    res.redirect('/admin/produits?success=Produit ajouté avec succès !');
  } catch (err) {
    console.error(err);
    const [produits] = await db.query('SELECT * FROM produits ORDER BY categorie, nom').catch(()=>[[]]);
    res.render('admin/produits', { title: 'Produits', admin: req.session.admin, produits, success: null, error: "Erreur lors de l'ajout." });
  }
});
router.post('/produits/dedup', requireAuth, async (req, res) => {
  try { await db.query('DELETE p1 FROM produits p1 INNER JOIN produits p2 WHERE p1.id > p2.id AND p1.nom = p2.nom'); } catch(_) {}
  res.redirect('/admin/produits?success=Doublons supprimés !');
});
router.post('/produits/:id/toggle', requireAuth, async (req, res) => {
  try { await db.query('UPDATE produits SET actif = NOT actif WHERE id = ?', [req.params.id]); } catch (_) {}
  res.redirect('/admin/produits');
});
router.post('/produits/:id/delete', requireAuth, async (req, res) => {
  try { await db.query('DELETE FROM produits WHERE id = ?', [req.params.id]); } catch (_) {}
  res.redirect('/admin/produits');
});

// ARTICLES
router.get('/articles', requireAuth, async (req, res) => {
  try {
    const [articles] = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.render('admin/articles', { title: 'Articles', admin: req.session.admin, articles, success: req.query.success||null, error: null });
  } catch (err) {
    res.render('admin/articles', { title: 'Articles', admin: req.session.admin, articles: [], success: null, error: null });
  }
});
router.post('/articles', requireAuth, upload.single('image_upload'), async (req, res) => {
  try {
    const { titre, contenu, image, categorie, auteur } = req.body;
    let img = req.file ? req.file.filename : (image && image.trim() ? image.trim() : 'nail-01.jpg');
    await db.query('INSERT INTO articles (titre, contenu, image, categorie, auteur) VALUES (?,?,?,?,?)', [titre, contenu, img, categorie||'MANICURE', auteur||'Admin']);
    res.redirect('/admin/articles?success=Article publié avec succès !');
  } catch (err) {
    const [articles] = await db.query('SELECT * FROM articles ORDER BY created_at DESC').catch(()=>[[]]);
    res.render('admin/articles', { title: 'Articles', admin: req.session.admin, articles, success: null, error: 'Erreur lors de la publication.' });
  }
});
router.post('/articles/:id/delete', requireAuth, async (req, res) => {
  try { await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]); } catch (_) {}
  res.redirect('/admin/articles');
});

// ── NOTIFICATIONS ──
router.get('/notifications', requireAuth, (req, res) => {
  res.render('admin/notifications', {
    title: 'Notifications',
    admin: req.session.admin,
    success: req.query.success || null,
  });
});

module.exports = router;

// ── COMMANDES PRODUITS ──
router.get('/commandes', requireAuth, async (req, res) => {
  try {
    const [commandes] = await db.query(`
      SELECT c.*, COUNT(ci.id) as nb_articles 
      FROM commandes c 
      LEFT JOIN commande_items ci ON c.id = ci.commande_id 
      GROUP BY c.id 
      ORDER BY c.created_at DESC
    `).catch(() => [[]]);
    const [[{total}]] = await db.query('SELECT COUNT(*) as total FROM commandes').catch(() => [[{total:0}]]);
    const [[{attente}]] = await db.query("SELECT COUNT(*) as attente FROM commandes WHERE statut='en_attente'").catch(() => [[{attente:0}]]);
    res.render('admin/commandes', { title: 'Commandes', admin: req.session.admin, commandes, stats: {total, attente}, success: req.query.success||null });
  } catch(e) {
    res.render('admin/commandes', { title: 'Commandes', admin: req.session.admin, commandes: [], stats: {total:0, attente:0}, success: null });
  }
});

router.post('/commandes/:id/statut', requireAuth, async (req, res) => {
  try { await db.query('UPDATE commandes SET statut=? WHERE id=?', [req.body.statut, req.params.id]); } catch(_) {}
  res.redirect('/admin/commandes');
});

router.get('/commandes/:id', requireAuth, async (req, res) => {
  try {
    const [[commande]] = await db.query('SELECT * FROM commandes WHERE id=?', [req.params.id]);
    const [items] = await db.query('SELECT * FROM commande_items WHERE commande_id=?', [req.params.id]);
    res.render('admin/commande-detail', { title: 'Commande #' + commande.numero, admin: req.session.admin, commande, items });
  } catch(e) { res.redirect('/admin/commandes'); }
});
