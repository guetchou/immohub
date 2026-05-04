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
