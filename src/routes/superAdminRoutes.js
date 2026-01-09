const express = require('express');
const router = express.Router();
const { authMiddleware, isSuperAdmin } = require('../middlewares/authMiddleware');
const { getDashboardStats , superAdminLogin} = require('../controllers/superAdminController');
// Dashboard stats
router.post('/login', superAdminLogin);
router.get('/dashboard-stats',  authMiddleware, isSuperAdmin, getDashboardStats);
module.exports = router;