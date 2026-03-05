// ============================================================
// KHOYANE BEAUTY — Service de Notifications (Web Push Only)
// ============================================================

// Notification console serveur (toujours active)
function logConsole(reservation) {
  const sep = '═'.repeat(55);
  console.log(`\n${sep}`);
  console.log('🔔 NOUVELLE RÉSERVATION — KHOYANE BEAUTY');
  console.log(sep);
  console.log(`👤  ${reservation.prenom} ${reservation.nom}`);
  console.log(`📞  ${reservation.telephone}`);
  console.log(`📧  ${reservation.email}`);
  console.log(`💅  ${reservation.service_nom || 'Non spécifié'}`);
  console.log(`📅  ${reservation.date_rdv} à ${reservation.heure_rdv}`);
  if (reservation.message) console.log(`💬  "${reservation.message}"`);
  console.log(sep + '\n');
}

// Déclencheur principal (Web Push géré côté admin via polling JS)
async function notifierNouvelleReservation(reservation) {
  logConsole(reservation);
  // La notification Web Push est déclenchée côté navigateur admin
  // via le polling /admin/api/reservations/nouvelles toutes les 30s
  return { webpush: true };
}

module.exports = { notifierNouvelleReservation };
