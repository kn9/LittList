var database = require('../bootstrap.js');
var Author     = require('../../models/author.js');
var Book     = require('../../models/book.js');
var AuthorFactory = require('./author.js');
var ReferenceFactory = require('./reference.js');

var BookFactory = {
    database: database,

    read: function (id, cb) {
        database.query('SELECT * FROM Books ' +
            'JOIN `References` ON Books.reference_id = References.id ' +
            'WHERE Books.reference_id = ?', id,
        function (err, rows, fields) {
            var row = rows[0];
            var book = new Book(row.title);
            book.setId(row.id);
            book.setISBN(row.ISBN);
            book.setEdition(row.edition);
            book.setPublisher(row.publisher);
            book.setPublicationPlace(row.publication_place);
            AuthorFactory.read(row.reference_id, function (authors) {
                book.addAuthors(authors);
                cb(book);
            });
        });
    },
    
    readAll: function (referenceIds, done) {
        var self = this;
        if (referenceIds.length === 0) done([]);    
        
        var books = [];
        for (i = 0; i < referenceIds.length; i++) {
            self.read(referenceIds[i], function (book) {
                books.push(book);
                referenceIds.pop();
                if (referenceIds.length === 0) done(books);
            }); 
        }
    },

    createBook: function (referenceId, book, done) {
        var self = this;
        database.query('INSERT INTO Books SET ?', {
            reference_id:      referenceId,
            publisher:         book.raw().publisher,
            publication_year:  book.raw().publicationYear,
            publication_place: book.raw().publicationPlace,
            isbn:              book.raw().ISBN,
            edition:           book.raw().edition
        }, function (err, BookResult) {
            if (err) throw err;
            var authors = book.raw().authors;
            AuthorFactory.createAuthors(referenceId, authors, done);
        });
    },

    create: function (book, done) {
        var self = this;
        ReferenceFactory.create(book.raw().title, function (ReferenceResult) {
            self.createBook(ReferenceResult.insertId, book, done);
        }); 
    },

    createBooks: function (books, done) {
        var self = this;

        if (books.length === 0) return done();

        var referenceIds = [];
        for (i = 0; i < books.length; i++) {
            this.create(books[i], function (referenceId) {
                referenceIds.push(referenceId);
                books.pop();
                if (books.length === 0)
                    self.readAll(referenceIds, done); 
            });
        }
    }
}

var book = new Book('auuee');
book.addAuthor(new Author('Stjerne banan'));
book.addAuthor(new Author('Banan banan'));

BookFactory.create(book, function (referenceId) {
    console.log('everything is finally over created', referenceId);
});

module.exports = BookFactory;
