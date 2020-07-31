const express = require("express")
const router = express.Router()
const Article = require('../models/article')
const Author = require('../models/author')
const { create } = require("../models/article")

// PATH = /articles
router.get('/', (req, res) => {
    Article.find({}, (err, foundArticles) => {
        res.render('articles/index.ejs', {
            articles: foundArticles
        })
    })
})

// PATH = /articles/new
router.get('/new', (req, res) => {
    // find all authors
    Author.find({}, (err, foundAuthors) => {
        // provide the foundAuthors to the view
        res.render('articles/new.ejs', {
            authors: foundAuthors
        })
    })
})

// PATH = /articles/:id
router.get('/:id', (req, res) => {
    // find an Author based on the article ID
    Author.findOne({ 'articles': req.params.id })
        // populate all articles associated with the found author
        .populate({
            // matches the field name in the Author Schema
            path: 'articles',
            match: { _id: req.params.id }
        }).exec((err, foundAuthor) => {
            if (err) console.log(err)

            res.render('articles/show.ejs', {
                author: foundAuthor,
                article: foundAuthor.articles[0]
            })
        })
})

// PATH = /articles/:id/edit
router.get('/:id/edit', (req, res) => {
    // get all authors from the DB for use in the form select field
    Author.find({}, (err, allAuthors) => {
        // return the author of the article we're editing
        Author.findOne({ 'articles': req.params.id })
            // BEFORE POPULATE
            // author : {
                // name: "Haruki Murakami",
                // articles: [ e60ef12543..., e60ef12543..., e60ef12543... ]
            // }
            .populate({ path: 'articles', match: { _id: req.params.id } })
            // AFTER POPULATE
            // author : {
                // name: "Haruki Murakami",
                // articles: [ 
                    // { 
                    //      _id: e60ef12543..., 
                    //      title: "Writing Well", 
                    //      body: "whatever" 
                    // } 
                // ]
            // }
            .exec((err, foundArticleAuthor) => {
                if (err) {
                    res.send(err)
                } else {
                    res.render('articles/edit.ejs', {
                        article: foundArticleAuthor.articles[0],
                        authors: allAuthors,
                        articleAuthor: foundArticleAuthor
                    })
                }
            })
    })
});

// PATH = /articles/:id
router.delete('/:id', (req, res) => {
    Article.findByIdAndDelete(req.params.id, (err, deletedArticle) => {
        // find the article's author
        Author.findOne({ 'articles': req.params.id }, (err, foundAuthor) => {
            if (err) res.send(err)

            // update the foundAuthor (remove the article from their array of articles)
            foundAuthor.articles.remove(req.params.id)
            // save the changes made to the found author
            foundAuthor.save((err, updatedAuthor) => {
                res.redirect('/articles')
            })    
        })
    })
})

// PATH  = /articles
router.post('/', (req, res) => {
    Article.create(req.body, (err, createdArticle) => {
        if (err) {
            console.log("Error in article#create", err)
        } else {
            // find an author by their ID (provided in the req.body from the select field)
            Author.findById(req.body.authorId, (err, foundAuthor) => {
                // push the article into the foundAuthor's array of articles
                foundAuthor.articles.push(createdArticle)
                // save the change we made to the foundAuthor
                foundAuthor.save((err, savedAuthor) => {
                    res.redirect('/articles')
                })
            })
        }
    })
})

// PATH = /articles/:id
router.put('/:id', (req, res) => {
	Article.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }, 
        (err, updatedArticle) => {
            // find an author through the id past to req.params
            Author.findOne({ 'articles': req.params.id }, (err, foundAuthor) => {
                // if the foundAuthor ID does not match req.body.authorID
                if (foundAuthor._id.toString() !== req.body.authorId) { 
                    // update the old author and then update the new author
                    foundAuthor.articles.remove(req.params.id)
                    foundAuthor.save((err, savedFoundAuthor) => {
                        // add the article to the new author's article array
                        Author.findById(req.body.authorId, (err, newAuthor) => {
                            newAuthor.articles.push(updatedArticle)
                            newAuthor.save((err, savedNewAuthor) => {
                                res.redirect(`/articles/${ req.params.id }`)
                            })
                        })
                    })
                } else {
                    // redirect to the article show page
                    res.redirect(`/articles/${ req.params.id }`)
                }
            })
	    })
})

module.exports = router
