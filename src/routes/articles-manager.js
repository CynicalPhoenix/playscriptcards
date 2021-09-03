const { Router } = require('express');
const router = Router();

const fs = require('fs')
const path = require('path');
const pool = require('../database');

const upload = require('./../lib/upload');

router.get('/', async (req, res) => {
	const articles = await pool.query('SELECT * FROM tbArticles');
	res.render('news-manager/list', { articles });
})

//? ADD ROUTE
router.get('/add', (req, res) => {
	res.render('news-manager/add');
})

const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }])
router.post('/add', cpUpload, async (req, res) => {
	const file = req.files['file'][0];
	const image = req.files['image'][0];
	console.log(file);
	console.log(image);

	// const fileContent = fs.readFileSync(path.join(__dirname, '../public/uploads', file.filename), 'utf8');
	const fileRoute = path.join('uploads', file.filename);
	const imageRoute = path.join('uploads', image.filename);
	const { route, title, description } = req.body;

	const newArticle = {
		articleRoute: route,
		articleTitle: title,
		articleContent: fileRoute,
		articleImage: imageRoute,
		articleDescription: description
	}
	await pool.query('INSERT INTO tbArticles SET ?', [newArticle]);
	fs.unlink(path.join(__dirname, '../public/uploads', file.filename), (err) => {
		if (err) {
			console.log(err);
		}
	});
	res.redirect('/articles-manager');
});

//! DELETE ROUTE
router.get('/delete/:id', async (req, res) => {
	const {id} = req.params;
	await pool.query('DELETE FROM tbArticles WHERE articleId = ?', [id]);
	res.redirect('/articles-manager');
});

//* EDIT ROUTE
router.get('/edit/:id', async (req, res) => {
	const {id} = req.params;
	const articles = await pool.query('SELECT * FROM tbArticles WHERE articleId = ?', [id]);
	console.log(articles);
	res.render('news-manager/edit', { article: articles[0] });
});
module.exports = router;