const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');

passport.use('local.auth', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);

    const rows = await pool.query('SELECT * FROM tbArticlesEditors WHERE editorUsername = ?', [username]);
    if (rows.length > 0) {
        const editor = rows[0];
        if (password == editor.editorPassword) {
            done(null, editor, req.flash('success','Welcome master'));
        } else {
            done(null, false, req.flash('message', 'Are you trying hack us?, the password is incorrect'));
        }
    } else {
        return done(null, false, req.flash('message','You not exist! it is scary'));
    }
}));

passport.serializeUser((editor, done) => {
    done(null, editor.editorId);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM tbArticlesEditors WHERE editorId = ?', [id]);
    const editor = rows[0];
    done(null, editor);
})