const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ─── Multer config (upload images) ────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = 'upload-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  allowed.includes(path.extname(file.originalname).toLowerCase()) ? cb(null, true) : cb(new Error('Image requise'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
app.locals.upload = upload;

// ─── Configuration EJS ────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'nailart_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentPath = req.path;
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', require('./routes/index'));
app.use('/services', require('./routes/services'));
app.use('/galerie', require('./routes/galerie'));
app.use('/blog', require('./routes/blog'));
app.use('/reservation', require('./routes/reservation'));
app.use('/produits', require('./routes/produits'));
app.use('/commandes', require('./routes/commandes'));
app.use('/admin', require('./routes/admin'));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page non trouvée' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n🌸 NAILART STUDIO démarré!');
  console.log('🔗 http://localhost:' + PORT);
  console.log('🔧 Admin: http://localhost:' + PORT + '/admin\n');
});

module.exports = app;
