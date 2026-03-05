-- ==============================================
-- KHOYANE BEAUTY - Base de données MySQL
-- ==============================================

CREATE DATABASE IF NOT EXISTS nailart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nailart_db;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  categorie ENUM('manicure','pedicure','nail_care','cosmetics') NOT NULL,
  image VARCHAR(255),
  duree INT COMMENT 'duree en minutes',
  actif TINYINT(1) DEFAULT 1,
  remise_type ENUM('none','pourcentage','montant') DEFAULT 'none',
  remise_valeur DECIMAL(10,2) DEFAULT 0,
  remise_label VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS galerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(100),
  image VARCHAR(255) NOT NULL,
  categorie VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  service_id INT,
  date_rdv DATE NOT NULL,
  heure_rdv TIME NOT NULL,
  message TEXT,
  statut ENUM('en_attente','confirme','annule') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  categorie VARCHAR(50),
  stock INT DEFAULT 0,
  actif TINYINT(1) DEFAULT 1,
  remise_type ENUM('none','pourcentage','montant') DEFAULT 'none',
  remise_valeur DECIMAL(10,2) DEFAULT 0,
  remise_label VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  contenu TEXT NOT NULL,
  image VARCHAR(255),
  categorie VARCHAR(50),
  auteur VARCHAR(100) DEFAULT 'Admin',
  vues INT DEFAULT 0,
  commentaires INT DEFAULT 0,
  publie TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS temoignages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  texte TEXT NOT NULL,
  note INT DEFAULT 5,
  image VARCHAR(255),
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- DONNEES REELLES - KHOYANE BEAUTY
-- Yoff Apecsy, en face de la CBEAO, Dakar
-- Tél: +221 78 247 81 47 / +221 78 136 53 58
-- ==============================================

-- POSE MAINS
INSERT INTO services (nom, description, prix, categorie, image, duree) VALUES
('Vernis Perm / Ongles Naturel', 'Vernis semi-permanent longue tenue sur ongles naturels. Design non compris.', 5000, 'manicure', 'nail-01.jpg', 45),
('Pose Americaine', 'Pose americaine classique resistante et elegante. Design non compris.', 7000, 'manicure', 'nail-05.jpg', 60),
('Pose Americaine XL', 'Pose americaine en longueur XL. X-tra longueur +2.000fr. Design non compris.', 10000, 'manicure', 'nail-08.jpg', 75),
('Gainage', 'Gainage des ongles naturels pour plus de resistance. Design non compris.', 10000, 'manicure', 'nail-12.jpg', 60),
('Gel-X', 'Pose Gel-X pour extensions naturelles et resistantes. Design non compris.', 10000, 'manicure', 'nail-05.jpg', 60),
('Gel / Resine Extension', 'Extension en gel ou resine pour ongles longs. Design non compris.', 12000, 'manicure', 'nail-06.jpg', 90),
('Pop It (sans colle)', 'Pose Pop It sans colle, douce pour les ongles. Design non compris.', 15000, 'manicure', 'nail-07.jpg', 45),
('Chabblon (sans colle)', 'Pose chabblon sans colle pour un resultat impeccable. Design non compris.', 18000, 'manicure', 'nail-08.jpg', 60),
-- SOINS MAINS (Pose non comprise)
('Manucure Simple', 'Manucure simple - soin et mise en beaute des ongles. Pose non comprise.', 5000, 'nail_care', 'nail-09.jpg', 30),
('Manucure Jelly-Spa', 'Manucure jelly-spa relaxante - bain gelifie nourrissant. Pose non comprise.', 10000, 'nail_care', 'nail-10.jpg', 45),
('Manucure Parafin', 'Manucure au parafin - soin hydratant intensif a la cire chaude. Pose non comprise.', 15000, 'nail_care', 'nail-11.jpg', 60),
('Depose Cap-American', 'Depose professionnelle cap-american sans abimer les ongles naturels.', 4000, 'nail_care', 'nail-12.jpg', 20),
('Depose Gel Main', 'Depose du gel soigneusement pour preserver vos ongles.', 5000, 'nail_care', 'nail-13.jpg', 25),
('Depose Resine Main', 'Depose de la resine avec soin et respect des ongles.', 6000, 'nail_care', 'nail-01.jpg', 25),
-- DESIGN
('Design Nail Art', 'Creations nail art personnalisees sur mesure. A partir de 1.000fr.', 1000, 'cosmetics', 'nail-05.jpg', 30);

INSERT INTO produits (nom, description, prix, image, categorie, stock) VALUES
('Vernis Semi-Permanent', 'Vernis gel longue tenue, large gamme de couleurs', 3500, 'nail-21.jpg', 'vernis', 50),
('Kit Nail Art Professionnel', 'Outils professionnels pour nail art creatif', 15000, 'nail-22.jpg', 'outils', 20),
('Huile Cuticules Naturelle', 'Huile nourrissante pour cuticules et ongles', 4000, 'nail-23.jpg', 'soins', 35),
('Strass et Decorations', 'Collection strass, gems et ornements nail art', 5000, 'nail-24.jpg', 'deco', 60),
('Set Lime Accessoires', 'Set de limes et accessoires manucure pro', 6000, 'nail-25.jpg', 'outils', 40),
('Base & Top Coat', 'Protection et finition brillante longue duree', 4500, 'nail-26.jpg', 'vernis', 45),
('Lime Professionnelle', 'Lime grain 180/240 pour ongles naturels et gel', 2000, 'nail-27.jpg', 'outils', 80),
('Soin Parafine Mains', 'Masque parafine nourrissant et hydratant', 8000, 'nail-28.jpg', 'soins', 25);

INSERT INTO articles (titre, contenu, image, categorie) VALUES
('Nos Tarifs Mains 2024 - Khoyane Beauty', 'Decouvrez notre grille tarifaire complete. Pose americaine a partir de 7.000fr, vernis perm des 5.000fr, soins spa jelly a 10.000fr. Design a partir de 1.000fr. X-tra longueur +2.000fr. Retrouvez-nous a Yoff Apecsy, en face de la CBEAO, Dakar. Tél: +221 78 247 81 47 / +221 78 136 53 58', 'nail-01.jpg', 'MANICURE'),
('Les Tendances Nail Art Dakar 2024', 'Le nail art a Dakar est en plein essor ! Les poses americaines XL, le gel-x et les designs personnalises sont tres demandes. Chez Khoyane Beauty, nos techniciennes creent des designs uniques adaptes a votre style. Venez nous voir a Yoff Apecsy, Dakar.', 'nail-05.jpg', 'MANICURE'),
('Prendre Soin de ses Ongles au Quotidien', 'Les secrets pour garder de beaux ongles entre vos seances chez Khoyane Beauty. Hydratez vos cuticules chaque soir, portez des gants pour les taches menageres, et consultez votre technicienne pour les soins de depose professionnels.', 'nail-08.jpg', 'NAIL BAR');

INSERT INTO temoignages (nom, texte, note) VALUES
('Aminata Sow', 'Khoyane Beauty est le meilleur salon de Dakar ! Ma pose americaine XL est magnifique et ca dure longtemps. Je recommande vivement !', 5),
('Fatou Diagne', 'La manucure jelly-spa etait incroyablement relaxante. Les techniciennes sont tres professionnelles et a l ecoute. J y retourne chaque mois !', 5),
('Rokhaya Ndiaye', 'Tres satisfaite de ma pose gel-x avec design. Le travail est soigne et les prix sont honnetes. Adresse a Yoff Apecsy facile a trouver.', 5),
('Marie-Claire Faye', 'Excellent service, ambiance chaleureuse ! La pose americaine tient plus de 3 semaines. Khoyane Beauty, c est mon incontournable !', 5);

-- Admin (password: admin123)
-- Hash généré avec bcryptjs: bcrypt.hash('admin123', 10)
-- Pour régénérer: node -e "require('bcryptjs').hash('admin123',10).then(h=>console.log(h))"
INSERT INTO admins (nom, email, password) VALUES
('Khoyane Admin', 'admin@khoyanebeauty.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE password='$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

-- ⚠️  MOT DE PASSE PAR DÉFAUT: "password"
-- Pour utiliser "admin123", lancez dans MySQL:
-- UPDATE admins SET password = (SELECT password FROM (SELECT password FROM admins LIMIT 1) tmp);
-- Ou simplement configurez ADMIN_PASSWORD=admin123 dans .env (voir routes/admin.js)

-- =============================================
-- POUR METTRE À JOUR LE MOT DE PASSE ADMIN
-- =============================================
-- Lancez ce script Node.js pour générer un nouveau hash:
--
--   node -e "require('bcryptjs').hash('VOTRE_MOT_DE_PASSE', 10).then(h => console.log(h))"
--
-- Puis mettez à jour:
--   UPDATE admins SET password = 'HASH_GÉNÉRÉ' WHERE email = 'admin@khoyanebeauty.com';
--
-- OU plus simplement: configurez ADMIN_PASSWORD dans .env
-- La connexion fonctionnera directement sans toucher à la DB

-- =============================================
-- SYSTÈME DE REMISES — KHOYANE BEAUTY
-- (colonnes déjà incluses dans CREATE TABLE)
-- Si vous migrez depuis une ancienne version,
-- exécutez manuellement si besoin :
--   ALTER TABLE services ADD COLUMN remise_type ENUM('none','pourcentage','montant') DEFAULT 'none';
--   ALTER TABLE services ADD COLUMN remise_valeur DECIMAL(10,2) DEFAULT 0;
--   ALTER TABLE services ADD COLUMN remise_label VARCHAR(50) DEFAULT NULL;
--   ALTER TABLE produits ADD COLUMN remise_type ENUM('none','pourcentage','montant') DEFAULT 'none';
--   ALTER TABLE produits ADD COLUMN remise_valeur DECIMAL(10,2) DEFAULT 0;
--   ALTER TABLE produits ADD COLUMN remise_label VARCHAR(50) DEFAULT NULL;
-- =============================================

-- Codes promo globaux
CREATE TABLE IF NOT EXISTS codes_promo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) UNIQUE NOT NULL,
  type_remise ENUM('pourcentage','montant') NOT NULL,
  valeur DECIMAL(10,2) NOT NULL,
  description VARCHAR(100),
  utilisations INT DEFAULT 0,
  max_utilisations INT DEFAULT NULL,
  date_expiration DATE DEFAULT NULL,
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO codes_promo (code, type_remise, valeur, description, max_utilisations) VALUES
('BIENVENUE10', 'pourcentage', 10, 'Remise bienvenue 10%', 100),
('FLASH20', 'pourcentage', 20, 'Flash sale 20%', 50);

-- =============================================
-- SYSTÈME DE COMMANDES PRODUITS — KHOYANE BEAUTY
-- =============================================

-- ============================================================
-- SYSTÈME COMMANDES PRODUITS — KHOYANE BEAUTY
-- ============================================================
CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) DEFAULT NULL,
  telephone VARCHAR(30) NOT NULL,
  adresse TEXT,
  mode_paiement ENUM('especes','wave','orange_money','virement') NOT NULL,
  ref_paiement VARCHAR(100) DEFAULT NULL,
  statut ENUM('en_attente','confirmee','payee','livree','annulee') DEFAULT 'en_attente',
  montant_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  produit_id INT DEFAULT NULL,
  nom_produit VARCHAR(150) NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  sous_total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);
