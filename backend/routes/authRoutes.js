const router         = require('express').Router();
const passport       = require('passport');
const authController = require('../controllers/authController');
const protect        = require('../middleware/authMiddleware');
const { upload }     = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login',    authController.login);
router.get('/me',                protect, authController.getProfile);
router.put('/profile/image',     protect, upload.single('image'), authController.updateProfileImage);
router.put('/profile/name',      protect, authController.updateName);
router.delete('/profile',        protect, authController.deleteAccount);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    session: false,
  }),
  authController.oauthSuccess
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api/auth/failure',
    session: false,
  }),
  authController.oauthSuccess
);

router.get('/failure', authController.oauthFailure);

module.exports = router;
