var assert = require('assert');
var NDLA   = require('../../parsers/ndla/ndla.js');

describe('Nasjonal digital læringsarena', function () {
    
    it('should pass if url is from ndla', function () {
        var ndla = new NDLA();  
        assert.equal(ndla.isNDLAURL('http://ndla.no/node/2745'), true);
    });

    it('should not pass if url is not from ndla', function () {
        var ndla = new NDLA();  
        assert.equal(ndla.isNDLAURL('http://snl.no'), false);
    });
    
    it('should not pass if the url is not a "node"', function () {
        var ndla = new NDLA();  
        assert.equal(ndla.isNDLAURL('http://ndla.no/nb/contact-us'), false);
    });

    it('should not pass if the url is a "node"', function () {
        var ndla = new NDLA();  
        assert.equal(ndla.isNDLAURL('http://ndla.no/nb/node/2745'), true);
    });

    it('should pass if url is from ndla.no without protocol', function () {
        var ndla = new NDLA();  
        assert.equal(ndla.isNDLAURL('ndla.no/nb/node/2745'), true);
    });
    
    it('should prepend protocol if missing', function () {
        var ndla = new NDLA();
        assert.equal(ndla.appendPubdateParameter('ndla.no/nb/node/2745').substring(0, 7), 'http://');
    });

    it('should append the query parameter fag=8 to retrieve pubdates', function () {
        var ndla = new NDLA();
        assert.equal(ndla.appendPubdateParameter('ndla.no/nb/node/2745'), 'http://ndla.no/nb/node/2745?fag=8');
    });

    it('should not append the query parameter to retrieve pubdates if it\'s already in url', function () {
        var ndla = new NDLA();
        assert.equal(ndla.appendPubdateParameter('ndla.no/nb/node/2745?fag=8'), 'http://ndla.no/nb/node/2745?fag=8');
    });
    
    it('should not append the query parameter to retrieve pubdates if it\'s already in url with other parameters', function () {
        var ndla = new NDLA();
        assert.equal(ndla.appendPubdateParameter('ndla.no/nb/node/2745?&print=true&fag=8&read=false'), 'http://ndla.no/nb/node/2745?&print=true&fag=8&read=false');
    });

    it('should extract title from the html of a node resource', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<meta property="og:title" content="Introduksjon: Konflikter"/>');
        assert.equal(node.getTitle(), 'Introduksjon: Konflikter');
    });

    it('should extract single author from the html of a node resource', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<div class="owner rs_skip"><a href="/nb/node/58352">Marita Aksnes</a></div>');
        assert.equal(node.getAuthors()[0].getName(), 'Marita Aksnes');
    });

    it('should extract multiple authors from the html of a node resource', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<div class="owner rs_skip">'      + 
            '<a href="/nb/node/58352">Marita Aksnes</a>, '       + 
            '<a href="/nb/node/58674">Torgrim Gram Økland</a>, ' + 
            '<a href="/nb/node/74498">Svein Sandnes</a></div>'   +
        '</div>');
        assert.equal(node.getAuthors().length, 3);
    });

    it('should extract publication date of a resource with pubdate', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<div id="edit-dates" class="rs_skip">' + 
            '<b>Publisert:</b> 12.05.2010 (21:38)' +
        '</div>');
        assert.equal(node.getPublicationDate().getDate(), '12');
    });

    it('should extract publication date of a resource with pubdate and modified date', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<div id="edit-dates" class="rs_skip">' + 
            '<b>Publisert:</b> 10.05.2010 (21:38), ' +
            '<b>Oppdatert:</b> 06.05.2015 (08:22) ' +
        '</div>');
        assert.equal(node.getPublicationDate().getDate(), 10);
    });

    it('should simply move on if no publication date is present', function () {
        var ndla = new NDLA();
        var node = ndla.parse('<div id="edit-dates" class="rs_skip">' + 
        '</div>');
        assert.equal(node.getPublicationDate(), undefined);
    });
});
