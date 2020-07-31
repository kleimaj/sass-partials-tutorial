// require statements
const express = require('express')
const Author = require('../models/author')
const Article = require('../models/article')
// only needs router functionality
    // - .get, .post, .put, .delete
const router = express.Router()

// PATH = /authors
router.get('/', (req, res) => {
    Author.find({}, (err, foundAuthors) => {
        if (err) console.log(error)

        res.render('authors/index.ejs', {
            authors: foundAuthors
        })
    })
})

// PATH = /authors/new
router.get('/new', (req, res) => {
    res.render('authors/new.ejs')
})

// PATH = /authors/:id
router.get('/:id', (req, res) => {
	Author.findById(req.params.id)
		.populate({ path: 'articles' })
		.exec((err, foundAuthor) => {
			res.render('authors/show.ejs', {
				author: foundAuthor
			})
		})
})

// PATH = /authors
router.post('/', (req, res) => {
    // error-first callback signature
    Author.create(req.body, (err, createdAuthor) => {
        if (err) console.log(err)
        res.redirect('/authors')
    })
})

// PATH = /authors/:id
router.delete('/:id', (req, res) => {
	Author.findByIdAndDelete(req.params.id, (err, deletedAuthor) => {
		if (err) {
			console.log(err)
			res.send("Something went wrong.")
		} else {
			// get all article IDs associated with the deletedAuthor and 
			// remove them before responding
			Article.deleteMany({
				_id: { $in: deletedAuthor.articles }
			}, (err, data) => {
				res.redirect('/authors')
			})
		}
	})
})

// PATH = /authors/:id/edit
router.get('/:id/edit', (req, res) => {
	Author.findById(req.params.id, (err, foundAuthor) => {
		res.render('authors/edit.ejs', {
			author: foundAuthor
		})
	})
})

// PATH = /authors/:id
router.put('/:id', (req, res) => {
	Author.findByIdAndUpdate(req.params.id, req.body, () => {
		res.redirect('/authors')
	})
})

// export the router
module.exports = router
