const { Router } = require('express');
const router = Router();

const fs = require('fs')
const path = require('path');
const pool = require('../database');

const upload = require('./../lib/upload');

const { isLoggedIn } = require('../lib/auth-manager');

router.get('/', isLoggedIn, async (req, res) => {
	const articles = await pool.query('SELECT * FROM tbArticles');
	res.render('articles-manager/list', { articles, layout: 'articles-manager' });
})

//? ADD ROUTE -----------------------------------------------------------------------------------

router.get('/add', isLoggedIn, (req, res) => {
	res.render('articles-manager/add', { layout: 'articles-manager' });
});

const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }])
router.post('/add', cpUpload, async (req, res) => {
	const file = req.files['file'][0];
	const image = req.files['image'][0];

	// const fileContent = fs.readFileSync(path.join(__dirname, '../public/uploads', file.filename), 'utf8');
	const { route, title, description } = req.body;

	const newArticle = {
		articleRoute: route,
		articleTitle: title,
		articleContent: file.filename,
		articleImage: image.filename,
		articleDescription: description
	}
	pool.query('INSERT INTO tbArticles SET ?', [newArticle], (err) => {
		if (err) {
			if (err.code === 'ER_DUP_ENTRY') {
				fs.unlinkSync(path.join(__dirname, '../public/uploads', file.filename));
				fs.unlinkSync(path.join(__dirname, '../public/uploads', image.filename));
				req.flash('message', 'Article route already exists');
				res.redirect('/articles-manager/add');
			}
		} else {
		req.flash('success', 'Article added succesfully');
		res.redirect('/articles-manager');
		}
	});
});

//! DELETE ROUTE -----------------------------------------------------------------------------------

router.get('/delete/:id', isLoggedIn, async (req, res) => {
	const { id } = req.params;

	const articles = await pool.query('SELECT * FROM tbArticles WHERE articleId = ?', [id]);
	const article = articles[0];

	fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleContent));
	fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleImage));

	await pool.query('DELETE FROM tbArticles WHERE articleId = ?', [id]);
	req.flash('success', 'Article deleted succesfully');
	res.redirect('/articles-manager');
});

//* EDIT ROUTE -----------------------------------------------------------------------------------

router.get('/edit/:id', isLoggedIn, async (req, res) => {
	const { id } = req.params;
	const articles = await pool.query('SELECT * FROM tbArticles WHERE articleId = ?', [id]);
	const article = articles[0];
	res.render('articles-manager/edit', { article, layout: 'articles-manager' });
});

router.post('/edit/:id', cpUpload,  async (req, res) => {
	const { id } = req.params;

	const { route, title, description } = req.body;

	const articles = await pool.query('SELECT * FROM tbArticles WHERE articleId = ?', [id]);
	const article = articles[0];
	
	// si los inputs de archivo están vacios
	if (!req.files || Object.keys(req.files).length === 0) {
		const newArticle = {
			articleRoute: route,
			articleTitle: title,
			articleDescription: description
		}
		pool.query('UPDATE tbArticles SET ? WHERE articleId = ?', [newArticle, id], (err) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					req.flash('message', 'Article route already exists');
					res.redirect('/articles-manager/edit/' + id);
				}
			} else {
				req.flash('success', 'Article changed succesfully');
				res.redirect('/articles-manager');	
			}
		});
	// si el input file tiene archivos
	} else if (req.files['file']) {
		// si el input file e image tienen archivos
		if (req.files['image']) {
			fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleImage));
			fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleContent));
			const image = req.files['image'][0];
			const file = req.files['file'][0];
			const newArticle = {
				articleRoute: route,
				articleTitle: title,
				articleContent: file.filename,
				articleImage: image.filename,
				articleDescription: description
			}
			pool.query('UPDATE tbArticles SET ? WHERE articleId = ?', [newArticle, id], (err) => {
				if (err) {
					if (err.code === 'ER_DUP_ENTRY') {
						fs.unlinkSync(path.join(__dirname, '../public/uploads', file.filename));
						fs.unlinkSync(path.join(__dirname, '../public/uploads', image.filename));
						req.flash('message', 'Article route already exists');
						res.redirect('/articles-manager/edit/' + id);
					}
				} else {
					fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleContent));
					fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleImage));
					req.flash('success', 'Article changed succesfully');
					res.redirect('/articles-manager');
				}
			});
		} else {
			
			const file = req.files['file'][0];
			const newArticle = {
				articleRoute: route,
				articleTitle: title,
				articleContent: file.filename,
				articleDescription: description
			}
			pool.query('UPDATE tbArticles SET ? WHERE articleId = ?', [newArticle, id], (err) => {
				if (err) {
					if (err.code === 'ER_DUP_ENTRY') {
						fs.unlinkSync(path.join(__dirname, '../public/uploads', file.filename));
						req.flash('message', 'Article route already exists');
						res.redirect('/articles-manager/edit/' + id);
					}
				} else {
					fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleContent));
					req.flash('success', 'Article changed succesfully');
					res.redirect('/articles-manager');
				}
			});
		}
	// si el input image tiene archivos
	} else if ( req.files['image'] ) {
		const image = req.files['image'][0];
		const newArticle = {
			articleRoute: route,
			articleTitle: title,
			articleImage: image.filename,
			articleDescription: description
		}
		pool.query('UPDATE tbArticles SET ? WHERE articleId = ?', [newArticle, id], (err) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					fs.unlinkSync(path.join(__dirname, '../public/uploads', image.filename));
					req.flash('message', 'Article route already exists');
					res.redirect('/articles-manager/edit/' + id);
				}
			} else {
				fs.unlinkSync(path.join(__dirname, '../public/uploads', article.articleImage));
				req.flash('success', 'Article changed succesfully');
				res.redirect('/articles-manager');	
			}
		});
	}	
});

module.exports = router;