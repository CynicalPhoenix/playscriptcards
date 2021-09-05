const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/auth', (req, res) => {
    res.render('articles-manager/auth', { layout: 'articles-manager' });
});

router.post('/auth', (req, res, next) => {
    passport.authenticate('local.auth', {
        successRedirect: '/articles-manager',
        failureRedirect: '/articles-manager/auth',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/articles-manager/auth')
});

module.exports = router;