var express = require('express');
var router = express.Router();
const { requestAll, requestOne, insertItem, findItem, updateItem, deleteItem } = require('../db/services');
const { body, query, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  requestAll('books', (err, books) => {
    if (err) {
      return next(err);
    }
    res.send(books);
  });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  requestOne('books', id, (err, book) => {
    if (err) {
      return next(err);
    }
    res.send(book);
  });
});

router.get('/search',
  query('title').notEmpty().escape(),
  query('author').notEmpty().escape(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array()});
    }
    const { title, author } = req.query;
    findItem('books', title, author, (err, book) => {
      if (err) {
        return next(err);
      }
      res.send(book);
    });
  }
);

router.post('/',
  body('title').isLength({ min: 5 }).escape(),
  body('author').isLength({ min: 5 }).escape(),
  body('genre').isLength({ min: 4 }).escape(),
  body('published_date').isDate(),
  body('summary').isLength({ min: 8 }).escape(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json( { errors: errors.array() });
    }
    const nextBook = req.body;
    insertItem('books', nextBook, (err, book) => {
      if (err) {
        return next(err);
      }
      res.send(nextBook);
    });
  }
);

router.put('/:id',
  body('title').isLength({ min: 5 }).escape(),
  body('author').isLength({ min: 5 }).escape(),
  body('genre').isLength({ min: 5 }).escape(),
  body('published_date').isDate(),
  body('summary').isLength({ min: 5 }).escape(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array()});
    }
    const id = req.params.id;
    const body = req.body;
    if (body.id !== +id) {
      return res.sendStatus(409);
    }
    requestOne('books', id, (err, book) => {
      if (err) {
        return next(err);
      }
      if (!book.length) {
        return res.sendStatus(404);
      }
      updateItem('books', id, body, (err, updatedBook) => {
        if (err) {
          return next(err);
        }
        res.send(updatedBook);
      });
    });
  }
);

router.delete('/:id', function(req, res, next) {
  const id = req.params.id;
  requestOne('books', id, (err, book) => {
    if (err) {
      next(err);
    }
    if (!book.length) {
      return res.sendStatus(404);
    }
    deleteItem('books', id, err => {
      if (err) {
        next(err);
      }
      res.sendStatus(204);
    });
  });
});

module.exports = router;
