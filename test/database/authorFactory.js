var assert      = require('assert');
var mysql       = require('mysql');
var config      = require('../../config.js');
var Author      = require('../../models/author.js');
var AuthorFactory = require('../../database/factories/author.js');

describe('authorFactory', function () {
    it('changes database to the testdatabase', function (done) {
        AuthorFactory.database.changeUser({
            database: config.database.test.database
        }, function (err) {
            done();
        });
    });

    it('creates an author entry in the database for reference 1', function (done) {
        var author = new Author('Jo Nesbø');
        AuthorFactory.create(1, author, function (results) {
            done();
        });
    });
}); 
