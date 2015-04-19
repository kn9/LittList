var ISBNValidator = require('isbn').ISBN;

function Book (title) {
    var id;
    var title     = title; 
    var authors   = [];
    var ISBN;
    var publisher;
    var publicationYear;
    var publicationPlace;
    var edition; 
    this.isInList = false;
    var self = this;
    
    this.getId = function () {
        return id;
    }

    this.setId = function (databaseId) {
        id = databaseId;
    }

    this.getTitle = function () {
        return title;
    }
    
    this.getPublisher = function () {
        return publisher;
    }
    
    this.getPublicationPlace = function () {
        return publicationPlace;
    }
    
    this.getPublicationYear = function () {
        return publicationYear;
    }

    this.getEdition = function () {
        return edition;
    }
    
    this.setEdition = function (bookEdition) {
        edition = bookEdition; 
    }
    
    this.setPublisher = function (bookPublisher) {
        publisher = bookPublisher; 
    }
    
    this.setPublicationPlace = function (place) {
        place = place || '';
        publicationPlace = place.replace(/\W/g, ''); 
    }
    
    this.setPublicationYear = function (year) {
        year = '' + year;
        year = year.replace(/[^0-9]/g, '');
        publicationYear = parseInt(year); 
    }

    this.getISBN = function () {
        return ISBN || false;
    }

    this.setISBN = function (ISBNno) {
        if (ISBNValidator.parse(ISBNno))
            ISBN = ISBNno;
    }
    
    this.addAuthor = function (author) {
        authors.push(author); 
    }
    
    this.addAuthors = function (authors) {
        authors.forEach(function (author) {
            self.addAuthor(author); 
        });
    }
    
    this.getAuthors = function () {
        return authors; 
    }
    
    this.raw = function () {
        return {
            title: title,
            edition: edition,
            publisher: publisher,
            publicationYear: publicationYear,
            publicationPlace: publicationPlace,
            ISBN: ISBN,
            authors: authors
        };
    }

    this.toString = function () {
        return [
            this.getTitle(),
            this.getEdition(),
            this.getPublisher()
        ].join(', ');
    }
}

module.exports = Book;
