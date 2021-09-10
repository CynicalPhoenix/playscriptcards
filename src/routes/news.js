const express = require('express');
const router = express.Router();
const marked = require('marked');
const fs = require('fs');
const path = require('path');

const pool = require('../database');

router.get('/', async (req, res) => {
	const articles = await pool.query('SELECT * FROM tbArticles');
	res.render('news/list', { articles });
});

router.get('/:articleRoute', async (req, res) => {
    const { articleRoute } = req.params;
	const articles = await pool.query('SELECT * FROM tbArticles WHERE articleRoute = ?', [articleRoute]);
    console.log(articles[0]);
    if (articles[0] == 'undefined') {
        res.redirect('/news');
    } else {
        const article = articles[0];
        const markdown = marked(fs.readFileSync(path.join(__dirname, '../public/uploads', article.articleContent), 'utf8'), { sanitize: true });
	    res.render('news/content', { article, markdown });
    }
});

module.exports = router;