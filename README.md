# 💅 NailArt Studio - Application Node.js + EJS + Bootstrap + MySQL

## 🚀 Installation & Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données MySQL
1. Ouvrez MySQL Workbench ou phpMyAdmin
2. Importez le fichier `config/database.sql`
3. Cela créera la base `nailart_db` avec toutes les tables et données de démo

### 3. Configurer les variables d'environnement
Editez le fichier `.env` avec vos informations MySQL :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=nailart_db
SESSION_SECRET=nailart_secret_2024
PORT=3000
```

### 4. Démarrer l'application
```bash
# Mode normal
npm start

# Mode développement (avec nodemon)
npm run dev
```

### 5. Accéder à l'application
- 🌐 **Site principal** : http://localhost:3000
- 🔧 **Admin** : http://localhost:3000/admin
  - Email: `admin@nailart.com`
  - Mot de passe: `admin123`

---

## 📁 Structure du projet
```
nailart-app/
├── app.js                  # Point d'entrée principal
├── .env                    # Variables d'environnement
├── package.json
├── config/
│   ├── db.js              # Connexion MySQL
│   └── database.sql       # Schéma + données de démo
├── routes/
│   ├── index.js           # Page d'accueil + About + Contact
│   ├── services.js        # Page services
│   ├── galerie.js         # Galerie photos
│   ├── blog.js            # Blog + articles
│   ├── reservation.js     # Réservations
│   ├── produits.js        # Produits
│   └── admin.js           # Interface admin
├── views/
│   ├── partials/
│   │   ├── header.ejs     # En-tête + navbar
│   │   └── footer.ejs     # Pied de page + newsletter
│   ├── index.ejs          # Page d'accueil
│   ├── services.ejs       # Services
│   ├── galerie.ejs        # Galerie
│   ├── blog.ejs           # Blog
│   ├── blog-detail.ejs    # Article détail
│   ├── reservation.ejs    # Réservation
│   ├── produits.ejs       # Produits
│   ├── about.ejs          # À propos
│   ├── contact.ejs        # Contact
│   ├── 404.ejs            # Page 404
│   └── admin/
│       ├── login.ejs      # Login admin
│       ├── dashboard.ejs  # Tableau de bord
│       ├── reservations.ejs
│       ├── services.ejs
│       └── articles.ejs
└── public/
    ├── css/style.css       # Styles personnalisés
    ├── js/main.js          # JavaScript
    └── images/             # Images du salon
```

## 🗃️ Base de données MySQL

Tables créées :
- `services` - Services proposés
- `galerie` - Photos de la galerie
- `reservations` - Prises de RDV
- `produits` - Produits à vendre
- `articles` - Articles du blog
- `temoignages` - Avis clients
- `admins` - Comptes administrateurs
- `newsletter` - Abonnés newsletter

## 🎨 Pages du site
- **/** - Accueil (hero, services, témoignages, blog, galerie)
- **/about** - À propos + équipe + valeurs
- **/services** - Liste des services par catégorie
- **/galerie** - Galerie photos avec filtres
- **/produits** - Boutique produits
- **/blog** - Articles + détail article
- **/reservation** - Formulaire de réservation
- **/contact** - Informations de contact
- **/admin** - Dashboard d'administration

## 🔧 Technologies utilisées
- **Backend**: Node.js + Express.js
- **Templates**: EJS (Embedded JavaScript)
- **CSS Framework**: Bootstrap 5.3
- **Base de données**: MySQL 2
- **Session**: express-session
- **Auth**: bcryptjs
- **Icons**: Bootstrap Icons
