const db = require('../db');

function auditLog(action, resource) {
  return (req, res, next) => {
    const userId = req.user?.id || null;
    const resourceId = req.params?.id || null;
    try {
      db.prepare(
        `INSERT INTO audit_logs (user_id, action, resource, resource_id, ip_address)
         VALUES (?, ?, ?, ?, ?)`
      ).run(userId, action, resource, resourceId, req.ip);
    } catch {
      // audit failure must not block the request
    }
    next();
  };
}

module.exports = auditLog;
