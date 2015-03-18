var assert  = require('assert');
var Book    = require('../../models/book.js');
var Author  = require('../../models/author.js'); 

describe('book', function () {
   it('should be able to be created', function () {
        var book = new Book('Title');
        assert.equal(book instanceof Book, true);
   }); 

   it('should have a title', function () {
        var book = new Book('Title');
        assert.equal(book.getTitle(), 'Title');
   }); 
   
   it('should have another title', function () {
        var book = new Book('Snømannen');
        assert.equal(book.getTitle(), 'Snømannen');
   }); 
   
   it('should have a year of publication', function () {
        var book = new Book('Snømannen');
        book.setPublicationYear(2007);
        assert.equal(book.getPublicationYear(), 2007);
   }); 
   
   it('should have no authors when no author is added', function () {
        var book = new Book('Title');
        assert.equal(book.getAuthors().length, 0)
   });     
   
   it('should have at least one author when an author is added', function () {
        var book = new Book('Title');
        book.addAuthor(new Author('Jo Nesbø'));
        assert.equal(book.getAuthors().length, 1)
   }); 
   
   it('should have a place where the book was published', function () {
        var book = new Book('Snømannen');
        book.setPublicationPlace('Oslo');
        assert.equal(book.getPublicationPlace(), 'Oslo');
   }); 
   
   it('should strip away any non-alphanumerical chars from pub.place', function () {
        var book = new Book('Snømannen');
        book.setPublicationPlace('[Oslo]*¨^!#"');
        assert.equal(book.getPublicationPlace(), 'Oslo');
   }); 
   
   it('should only allow numbers as the publication year', function () {
        var book = new Book('Snømannen');
        book.setPublicationYear('2015///');
        assert.equal(book.getPublicationYear(), '2015');

        book.setPublicationYear('.2015///');
        assert.equal(book.getPublicationYear(), '2015');
   });

   it('should have an edition number', function () {
        var book = new Book('Det tenkende mennesket');
        book.setEdition('2. utg.');
        assert.equal(book.getEdition(), '2. utg.');
   }); 
   
   it('should accept ISBN-13 codes', function () {
        var book = new Book('Det tenkende mennesket');
        book.setISBN('9788251918640');
        assert.equal(book.getISBN(), '9788251918640');
   }); 
   
   it('should not accept invalid ISBN-13 codes', function () {
        var book = new Book('Det tenkende mennesket');
        book.setISBN('9788234918649');
        assert.equal(book.getISBN(), false);
   }); 
});