const { ActivityLog } = require('../models');

async function logActivity(actorId, action, targetType, targetId, metadata) {
  try {
    await ActivityLog.create({ actorId, action, targetType, targetId, metadata });
  } catch (e) {
    // swallow logging errors
  }
}

function activityLogger(actionBuilder) {
  return async (req, _res, next) => {
    req.on('finish', async () => {
      try {
        const { actorId, action, targetType, targetId, metadata } = actionBuilder(req);
        if (actorId && action) {
          await logActivity(actorId, action, targetType, targetId, metadata);
        }
      } catch (_) {}
    });
    next();
  };
}

module.exports = { logActivity, activityLogger };
