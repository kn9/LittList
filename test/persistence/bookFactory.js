var assert      = require('assert');
var mysql       = require('mysql');
var config      = require('../../config.js');
var Book        = require('../../models/book.js');
var Author      = require('../../models/author.js');
var BookFactory = require('../../database/factories/book.js');

describe('bookFactory', function () {

    it('creates a book entry in the database', function (done) {
        var book = new Book('Snømannen');
        book.addAuthor(new Author('Jo Nesbø'));
        book.setPublicationPlace('Oslo');
        BookFactory.create(book, function (err, book) {
            done();
        });
    });

    it('reads the created book back from the database', function (done) {
        BookFactory.read(1, function (err, book) {
            assert.equal(book.getTitle(), 'Snømannen');
            done();
        });
    });
    
    it('reads the authors name from the inserted book', function (done) {
        BookFactory.read(1, function (err, book) {
            assert.equal(book.getAuthors()[0].getForename(), 'Jo');
            done();
        });
    });
}); 
