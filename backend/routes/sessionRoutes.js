const express = require('express');
const router  = express.Router();
const { saveSession, getSessions } = require('../controllers/sessionController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', saveSession);  
router.get('/',  getSessions);

module.exports = router;