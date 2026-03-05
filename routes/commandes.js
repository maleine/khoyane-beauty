const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

function genNumero() {
  const d   = new Date();
  const ts  = String(d.getFullYear()).slice(2) + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  const rnd = String(Math.floor(Math.random()*9000)+1000);
  return 'KB-' + ts + '-' + rnd;
}

// POST /commandes
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, adresse, mode_paiement, ref_paiement, notes, items } = req.body;

    if (!nom || !prenom || !telephone || !mode_paiement)
      return res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });

    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    if (!parsedItems || parsedItems.length === 0)
      return res.status(400).json({ success: false, error: 'Panier vide' });

    const total   = parsedItems.reduce((s, i) => s + Number(i.prix) * Number(i.quantite), 0);
    const numero  = genNumero();

    const [result] = await db.query(
      'INSERT INTO commandes (numero,nom,prenom,email,telephone,adresse,mode_paiement,ref_paiement,notes,montant_total) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [numero, nom, prenom, email||null, telephone, adresse||null, mode_paiement, ref_paiement||null, notes||null, total]
    );

    for (const item of parsedItems) {
      await db.query(
        'INSERT INTO commande_items (commande_id,produit_id,nom_produit,prix_unitaire,quantite,sous_total) VALUES (?,?,?,?,?,?)',
        [result.insertId, item.id||null, item.nom, item.prix, item.quantite, item.prix * item.quantite]
      );
      if (item.id) {
        await db.query('UPDATE produits SET stock = GREATEST(stock-?,0) WHERE id=?', [item.quantite, item.id]).catch(()=>{});
      }
    }

    const payLabels = { especes:'Espèces', wave:'Wave', orange_money:'Orange Money', virement:'Virement bancaire' };
    console.log(`\n${'═'.repeat(55)}`);
    console.log(`🛒  NOUVELLE COMMANDE — SUPER BEAUTY MARKET`);
    console.log(`📦  ${numero}`);
    console.log(`👤  ${prenom} ${nom}  📞 ${telephone}`);
    console.log(`💳  ${payLabels[mode_paiement]}  💰 ${Number(total).toLocaleString('fr-FR')} FCFA`);
    console.log('═'.repeat(55) + '\n');

    res.json({ success: true, numero, commandeId: result.insertId, total });
  } catch(err) {
    console.error('Erreur commande:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /commandes/nouvelles  — polling admin dashboard
router.get('/nouvelles', async (req, res) => {
  try {
    const since = req.query.since || new Date(Date.now()-60000).toISOString();
    const [nouvelles] = await db.query(
      "SELECT * FROM commandes WHERE created_at > ? AND statut='en_attente' ORDER BY created_at DESC",
      [since]
    ).catch(()=>[[]]);
    const [[{count}]] = await db.query("SELECT COUNT(*) as count FROM commandes WHERE statut='en_attente'").catch(()=>[[{count:0}]]);
    res.json({ nouvelles, total_attente: count });
  } catch(e) { res.json({ nouvelles:[], total_attente:0 }); }
});

module.exports = router;
