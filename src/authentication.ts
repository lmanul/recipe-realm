/** @file This file takes care of the login/logout and user management logic. */

import passport from 'passport';
import passportCustom from 'passport-custom';
import session from 'express-session';

const CustomStrategy = passportCustom.Strategy;

const users = [
    'akira',
    'eiichiro',
    'gosho',
];

passport.use(new CustomStrategy((request, done) => {
    if (users.includes(request.params.username)) {
        done(null, request.params.username);
    }
  }
));

const setUpAuthentication = (app) => {
    app.use(session({secret: 'shhhh', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    app.get('/logincallback/:username', passport.authenticate('custom', {
        successRedirect: '/lists',
        failureRedirect: '/login',
    }));
}

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
};

export {
    checkAuthenticated,
    setUpAuthentication,
    users,
}