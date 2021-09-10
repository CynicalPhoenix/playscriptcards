const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main-page/main-page');
});

router.get('/test', (req, res) => {
    res.render('test');
});

module.exports = router;