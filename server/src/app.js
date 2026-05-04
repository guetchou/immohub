const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const propertiesRoutes = require('./routes/properties.routes');
const furnishedRoutes = require('./routes/furnished.routes');
const ministryRoutes = require('./routes/ministry.routes');
const inspectionsRoutes = require('./routes/inspections.routes');
const complianceRoutes = require('./routes/compliance.routes');
const taxRoutes = require('./routes/tax.routes');
const reportsRoutes = require('./routes/reports.routes');
const tourismRoutes = require('./routes/tourism.routes');
const financeRoutes = require('./routes/finance.routes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ImmoHub API running', version: '1.0.0', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/furnished', furnishedRoutes);
app.use('/api/ministry', ministryRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/tourism-registry', tourismRoutes);
app.use('/api/finance', financeRoutes);

// Public NIMT verification (no auth required)
app.get('/api/verify-nimt/:nimt', (req, res) => {
  const db = require('./db');
  const row = db.prepare(
    `SELECT id, name, district, city, compliance_status, classification_level, total_units, nimt_number
     FROM furnished_properties WHERE nimt_number = ?`
  ).get(req.params.nimt.toUpperCase());
  if (!row) return res.status(404).json({ found: false });
  res.json({
    found: true,
    nimt: row.nimt_number,
    status: row.compliance_status,
    district: row.district,
    city: row.city,
    type: 'Meublé touristique',
    totalUnits: row.total_units,
    classificationLevel: row.classification_level || null,
  });
});

// Serve frontend SPA if STATIC_DIR is set and exists
const staticDir = process.env.STATIC_DIR;
if (staticDir && fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
