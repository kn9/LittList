var assert  = require('assert');
var rewire  = require('rewire');
var Book    = require('../../models/book.js');
var Website = require('../../models/website.js');
var Author  = require('../../models/author.js');
var List    = rewire('../../models/list.js');

describe('List', function () {
    
    it('should have a setter and getter for a unique id', function () {
        var list = new List();
        list.setId(1);
        assert.equal(list.getId(), 1);
    });

    it('should be possible to change the id', function () {
        var list = new List();
        list.setId(1);
        assert.equal(list.getId(), 1);
        list.setId(2);
        assert.equal(list.getId(), 2);
    });

    it('should generate a unique url upon creation of length 5', function () {
        assert.equal(new List().getUrl().length >= 5, true);
    });

    it('should be possible to set the url in the model', function () {
        var list = new List(); 
        list.setUrl('eRgcd2')
        assert.equal(list.getUrl(), 'eRgcd2');
    });

    it('should not be a collision in urls', function () {
        var urls = [];
        [new List(), new List(), new List()].forEach(function (currentList) {
            assert.equal(urls.indexOf(currentList.getUrl()), -1); 
            urls.push(currentList.getUrl());
        });
    });
    
    it('should be possible to add a book to the list', function () {
        var list = new List();
        var book = new Book();
        book.setId(1);
        list.addReference(book);
        assert.equal(list.getReferences().length, 1);
    });

    it('should be possible to add a website to the list', function () {
        var website = new Website('http://vg.no');
        website.setId(2);
        var list = new List();
        list.addReference(website);
        assert.equal(list.getReferences().length, 1);
    });
    
    it('should be possible to remove a reference from the list', function () {
        var list = new List();
        var firstBook   = new Book();
        var secondBook = new Book();
        var thirdBook   = new Book();
        firstBook.setId(1);
        secondBook.setId(2);
        thirdBook.setId(3);
        
        list.addReference(firstBook);
        list.addReference(secondBook);
        list.removeReference(1);

        assert.equal(list.getReferences().length, 1);
        assert.equal(list.getReferences()[0], secondBook);
        assert.equal(list.getReferences()[1], undefined);
    });

    it('should be possible to remove an array of references from the list', function () {
        var list = new List();
        var firstBook   = new Book();
        var secondBook = new Book();
        var thirdBook   = new Book();
        firstBook.setId(1);
        secondBook.setId(2);
        thirdBook.setId(3);
        
        list.addReference(firstBook);
        list.addReference(secondBook);
        list.addReference(thirdBook);
        list.removeReference([1, 2]);

        assert.equal(list.getReferences().length, 1);
    });

    it('should cast a string to ant int on remove', function () {
        var list = new List();
        var firstBook    = new Book();
        var secondBook   = new Book();

        firstBook.setId(1);
        secondBook.setId(2);
        list.addReference(firstBook);
        list.addReference(secondBook);
        list.removeReference('1');

        assert.equal(list.getReferences().length, 1);
        assert.equal(list.getReferences()[0].getId(), 2);
    });

    it('should be possible to remove a reference from the list', function () {
        var list = new List();
        var firstBook   = new Book();
        var secondBook = new Book();
        firstBook.setId(1);
        secondBook.setId(2);
        
        list.addReference([firstBook, secondBook]);

        assert.equal(list.getReferences().length, 2);
    });

    it('should have a createdAt attribute upon creation that is now', function () {
        assert.equal(new List().getCreatedAt().toString(), new Date().toString());
    });

    it('should have harvard1.csl as the default bibliography style', function () {
        var list = new List();
        assert.equal(list.getBibliographyStyle(), 'harvard1.csl');
    });

    it('should be possible to set the bibliography style as long as it is a valid filename', function () {
        var list = new List();
        list.setBibliographyStyle('harvard1.csl');
        assert.equal(list.getBibliographyStyle(), 'harvard1.csl');
    });

    it('should throw exception if bibliography style is an invalid filename', function () {
        var list = new List();
        assert.throws(function () {
            list.setBibliographyStyle('harvard yo give me that style');
        }, /Style/);
    });

    it('should have .csl as the default bibliography style', function () {
        var list = new List();
        assert.equal(list.getBibliographyLocale(), 'locales-nb-NO.xml');
    });

    it('should be possible to set the bibliography locale as long as it is a valid filename', function () {
        var list = new List();
        list.setBibliographyLocale('locales-en-GB.xml');
        assert.equal(list.getBibliographyLocale(), 'locales-en-GB.xml');
    });

    it('should throw exception if bibliography style is an invalid filename', function () {
        var list = new List();
        assert.throws(function () {
            list.setBibliographyLocale('english yo give me that locale');
        }, /Locale/);
    });

    it('should return days left until the list expires', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: 60 * 60 * 24 
            }
        });

        var list = new List();
        var expectedDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
        assert.equal(list.getExpirationDate().toString(), expectedDate.toString());
    });

    it('should determine that the list has not expired when lifetime is not passed', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: 60 * 60 * 24 
            }
        });

        var list = new List();
        assert.equal(list.hasExpired(), false);
    });

    it('should determine that the list has expired when lifetime is passed', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: -1 
            }
        });

        var list = new List();
        assert.equal(list.hasExpired(), true);
    });

    it('should have a human expiration date method which returns time until expiration', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: 60 * 60 * 5 // 5 hours 
            }
        });

        var list = new List();
        assert.equal(list.getHumanFriendlyLifetime(), 'om 5 timer');
    });

    it('should say that the list has expired when calling the human friendly lifetime', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: 60 * 60 * 5 * -1 // 5 hours ago
            }
        });

        var list = new List();
        assert.equal(list.getHumanFriendlyLifetime(), 'for 5 timer siden');
    });

    it('should round up to days in human friendly lifetime if there are days to expiration', function () {
        List.__set__('config', {
            bibliography: {
                lifetimeInSeconds: 60 * 60 * 24 * 3 // 3 days 
            }
        });

        var list = new List();
        assert.equal(list.getHumanFriendlyLifetime(), 'om 3 dager');
    });
});

