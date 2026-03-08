const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope:['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          user.profileImage = user.profileImage || {
            url: profile.photos[0]?.value || '',
            publicId: '',
          };
          await user.save();
          return done(null, user);
        }
        
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profileImage: {
            url: profile.photos[0]?.value || '',
            publicId: '',
          },
          authProvider: 'google',
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails?.find(email => email.primary)?.value || profile.emails?.[0]?.value;

        if (email) {
   
          user = await User.findOne({ email });

          if (user) {
            user.githubId = profile.id;
            user.profileImage = user.profileImage || {
              url: profile.photos[0]?.value || '',
              publicId: '',
            };
            await user.save();
            return done(null, user);
          }
        }

        user = await User.create({
          githubId: profile.id,
          email: email || `${profile.username}@github.local`,
          name: profile.displayName || profile.username,
          profileImage: {
            url: profile.photos[0]?.value || '',
            publicId: '',
          },
          authProvider: 'github',
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;