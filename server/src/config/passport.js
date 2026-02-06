const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'place_holder_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'place_holder_secret',
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists by email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Link google account
                user.googleId = profile.id;
                user.avatar = profile.photos[0].value;
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
));

module.exports = passport;
